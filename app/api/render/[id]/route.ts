import { NextRequest, NextResponse } from 'next/server'
import { sql } from '../../../../lib/db'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const appIdOrPasskey = resolvedParams.id

    // Fetch app by ID or passkey
    const apps = await sql`
      SELECT id, template_id, title, customizations 
      FROM apps 
      WHERE id = ${appIdOrPasskey} OR passkey = ${appIdOrPasskey}
    `

    if (apps.length === 0) {
      return new NextResponse('App not found', { status: 404 })
    }

    const app = apps[0]

    // Only index.html is supported for single-page templates
    const pageFileName = 'index.html'

    // Strict path resolution to prevent directory traversal
    const safeTemplateId = path.basename(app.template_id)
    const templatesDir = path.join(process.cwd(), 'public', 'templates')
    const requestedFilePath = path.join(templatesDir, safeTemplateId, pageFileName)

    // Ensure the resolved path is inside the templates directory
    if (!requestedFilePath.startsWith(templatesDir)) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    let htmlContent: string
    try {
      htmlContent = await fs.readFile(requestedFilePath, 'utf-8')
    } catch {
      return new NextResponse('Template page not found', { status: 404 })
    }

    // Apply customizations
    for (let [key, value] of Object.entries(app.customizations || {})) {
      let strValue = String(value || '')

      // Auto-inject fresh SAS token for Azure Blob images
      if (strValue.includes('blob.core.windows.net')) {
        try {
          // Strip any existing query parameters (like an old/invalid SAS token)
          const urlObj = new URL(strValue)
          const baseUrl = urlObj.origin + urlObj.pathname

          const { getBlobNameFromUrl, generateSASToken } = await import('../../../../lib/azure-storage')
          const blobName = getBlobNameFromUrl(baseUrl)
          if (blobName) {
            const sasToken = generateSASToken('images', blobName)
            strValue = `${baseUrl}?${sasToken}`
          }
        } catch (error) {
          console.error(`Failed to generate SAS token for ${key}:`, error)
        }
      }

      const regex = new RegExp(`{{${key}}}`, 'g')
      htmlContent = htmlContent.replace(regex, strValue)
    }

    // Inject Title and Analytics Script
    const searchParams = req.nextUrl.searchParams
    const clientProvidedSessionId = searchParams.get('sessionId') || ''

    const trackingScript = `
      <script>
        (function() {
          const appId = "${app.id}";
          const incomingSessionId = "${clientProvidedSessionId}";
          const sessionId = incomingSessionId || crypto.randomUUID();
          const startTime = Date.now();
          
          function sendEvent(type, data) {
            fetch('/api/analytics', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ appId, sessionId, eventType: type, eventData: data })
            }).catch(console.error);
          }
          
          window.addEventListener('load', () => {
            sendEvent('page_load', { url: window.location.href, userAgent: navigator.userAgent });
          });
          
          window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            fetch('/api/analytics', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ appId, sessionId, eventType: 'page_unload', eventData: { timeSpentMs: timeSpent } }),
              keepalive: true
            });
          });
          
          document.addEventListener('click', (e) => {
            const target = e.target;
            if (target && typeof target.tagName === 'string') {
              // Only track clicks on buttons
              if (target.tagName === 'BUTTON' || target.closest('button')) {
                const btn = target.tagName === 'BUTTON' ? target : target.closest('button');
                sendEvent('click', {
                  tagName: btn.tagName,
                  id: btn.id || '',
                  className: btn.className || '',
                  text: btn.innerText ? btn.innerText.substring(0, 50) : ''
                });
              }
            }
          });
          
          document.addEventListener('change', (e) => {
            const target = e.target;
            if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
              sendEvent('input', {
                tagName: target.tagName,
                id: target.id || '',
                name: target.name || '',
                value: target.value || ''
              });
            }
          });
        })();
      </script>
    `

    // Insert script before closing body tag, or just append it
    if (htmlContent.includes('</body>')) {
      htmlContent = htmlContent.replace('</body>', `${trackingScript}\n</body>`)
    } else {
      htmlContent += trackingScript
    }

    if (htmlContent.includes('</title>')) {
      htmlContent = htmlContent.replace(/<title>.*<\/title>/i, `<title>${app.title}</title>`)
    }

    return new NextResponse(htmlContent, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })

  } catch (error) {
    console.error('Render API error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
