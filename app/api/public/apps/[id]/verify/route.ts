import { NextRequest, NextResponse } from 'next/server'
import { sql } from '../../../../../../lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const appId = (await params).id
    const body = await req.json()
    const { passkey } = body

    if (!passkey) {
      return NextResponse.json(
        { error: 'Passkey is required' },
        { status: 400 }
      )
    }

    // Fetch the app with the given ID and passkey
    const apps = await sql(
      `SELECT id, creator_id, template_id, title, customizations, passkey, is_published, created_at, updated_at
       FROM apps
       WHERE id = $1 AND passkey = $2 AND is_published = true`,
      [appId, passkey]
    )

    if (apps.length === 0) {
      return NextResponse.json(
        { error: 'Invalid passkey or app not found' },
        { status: 404 }
      )
    }

    const app = apps[0]

    // Get template info
    const templates = await sql(
      `SELECT id, name, description, theme, html_template, css_template, js_template, thumbnail_url, customization_fields FROM templates WHERE id = $1`,
      [app.template_id]
    )

    const template = templates.length > 0 ? templates[0] : null

    return NextResponse.json(
      {
        app: {
          id: app.id,
          title: app.title,
          customizations: typeof app.customizations === 'string'
            ? JSON.parse(app.customizations)
            : app.customizations,
          template: template,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verify passkey error:', error)
    return NextResponse.json(
      { error: 'Failed to verify passkey' },
      { status: 500 }
    )
  }
}
