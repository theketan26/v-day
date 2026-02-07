import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { passkey: string } }
) {
  try {
    const passkey = (await params).passkey

    const apps = await sql(
      `SELECT id, user_id, template_id, title, customization, passkey, is_public, created_at, updated_at
       FROM apps
       WHERE passkey = $1`,
      [passkey]
    )

    if (apps.length === 0) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      )
    }

    const app = apps[0]

    // Get template info
    const templates = await sql(
      `SELECT id, name, config FROM templates WHERE id = $1`,
      [app.template_id]
    )

    const template = templates.length > 0 ? templates[0] : null

    return NextResponse.json(
      {
        app: {
          id: app.id,
          title: app.title,
          customization: typeof app.customization === 'string' 
            ? JSON.parse(app.customization) 
            : app.customization,
          template: template,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get public app error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch app' },
      { status: 500 }
    )
  }
}
