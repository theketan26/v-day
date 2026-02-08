'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import type { Template } from '../../types'

interface AppData {
  id: string
  title: string
  customizations: Record<string, string>
  template: Template
}

interface AppViewerWithPasskeyProps {
  appId: string
}

export function AppViewerWithPasskey({ appId }: AppViewerWithPasskeyProps) {
  const [passkey, setPasskey] = useState('')
  const [visitorName, setVisitorName] = useState('')
  const [visitorEmail, setVisitorEmail] = useState('')
  const [visitorPhone, setVisitorPhone] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [app, setApp] = useState<AppData | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Detect device information
  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent
    let os = 'Unknown'
    let browser = 'Unknown'
    let deviceType = 'desktop'

    // Detect OS
    if (userAgent.indexOf('Win') !== -1) os = 'Windows'
    else if (userAgent.indexOf('Mac') !== -1) os = 'MacOS'
    else if (userAgent.indexOf('Linux') !== -1) os = 'Linux'
    else if (userAgent.indexOf('Android') !== -1) os = 'Android'
    else if (userAgent.indexOf('iOS') !== -1 || userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) os = 'iOS'

    // Detect Browser
    if (userAgent.indexOf('Firefox') !== -1) browser = 'Firefox'
    else if (userAgent.indexOf('Chrome') !== -1) browser = 'Chrome'
    else if (userAgent.indexOf('Safari') !== -1) browser = 'Safari'
    else if (userAgent.indexOf('Edge') !== -1) browser = 'Edge'
    else if (userAgent.indexOf('Opera') !== -1 || userAgent.indexOf('OPR') !== -1) browser = 'Opera'

    // Detect Device Type
    if (/Mobi|Android/i.test(userAgent)) deviceType = 'mobile'
    else if (/Tablet|iPad/i.test(userAgent)) deviceType = 'tablet'

    return { os, browser, deviceType, userAgent }
  }

  const logAppView = async () => {
    try {
      const deviceInfo = getDeviceInfo()
      await fetch(`/api/public/apps/${appId}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_name: visitorName,
          visitor_email: visitorEmail || null,
          visitor_phone: visitorPhone || null,
          ...deviceInfo
        })
      })
    } catch (error) {
      console.error('Failed to log view:', error)
    }
  }

  const handleVerifyPasskey = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!visitorName.trim()) {
      toast.error('Please enter your name')
      return
    }

    if (!passkey.trim()) {
      toast.error('Please enter a passkey')
      return
    }

    setIsVerifying(true)
    try {
      const response = await fetch(`/api/public/apps/${appId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkey.trim() })
      })
      
      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || 'Invalid passkey')
        return
      }
      
      const data = await response.json()
      setApp(data.app)
      setIsVerified(true)
      
      // Log the app view
      await logAppView()
      
      toast.success('Access granted!')
    } catch (error) {
      console.error('Failed to verify passkey:', error)
      toast.error('Failed to verify passkey')
    } finally {
      setIsVerifying(false)
    }
  }

  useEffect(() => {
    if (app && iframeRef.current && isVerified) {
      renderTemplate()
    }
  }, [app, isVerified])

  const renderTemplate = () => {
    if (!app || !iframeRef.current) return

    // Replace placeholders in HTML template
    let html = app.template.html_template
    Object.entries(app.customizations).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      html = html.replace(regex, value || '')
    })

    // Create complete HTML document
    const fullHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${app.title}</title>
        <style>
          ${app.template.css_template || ''}
        </style>
      </head>
      <body>
        ${html}
        <script>
          // Generate SAS tokens for images if needed
          async function loadSecureImages() {
            const images = document.querySelectorAll('img[data-secure-src]');
            for (const img of images) {
              const baseUrl = img.getAttribute('data-secure-src');
              if (baseUrl && baseUrl.includes('blob.core.windows.net')) {
                try {
                  const response = await fetch('/api/get-image-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageUrl: baseUrl })
                  });
                  const data = await response.json();
                  if (data.secureUrl) {
                    img.src = data.secureUrl;
                  }
                } catch (error) {
                  console.error('Failed to load secure image:', error);
                }
              }
            }
          }
          
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadSecureImages);
          } else {
            loadSecureImages();
          }
          
          ${app.template.js_template || ''}
        </script>
      </body>
      </html>
    `

    // Write to iframe
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
    if (iframeDoc) {
      iframeDoc.open()
      iframeDoc.write(fullHTML)
      iframeDoc.close()
    }
  }

  // Show passkey form if not verified
  if (!isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-pink-100 rounded-full">
              <Lock className="w-8 h-8 text-pink-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Protected App
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Please enter your details to access this romantic app
          </p>
          
          <form onSubmit={handleVerifyPasskey} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                disabled={isVerifying}
                className="mt-1"
                required
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={visitorEmail}
                onChange={(e) => setVisitorEmail(e.target.value)}
                disabled={isVerifying}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={visitorPhone}
                onChange={(e) => setVisitorPhone(e.target.value)}
                disabled={isVerifying}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="passkey">Passkey <span className="text-red-500">*</span></Label>
              <Input
                id="passkey"
                type="text"
                placeholder="Enter passkey"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                disabled={isVerifying}
                className="mt-1"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Access App'
              )}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  // Show app if verified
  if (!app) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    )
  }

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-screen border-0"
      title={app.title}
      sandbox="allow-scripts allow-same-origin"
    />
  )
}
