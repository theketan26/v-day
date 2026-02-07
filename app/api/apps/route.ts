import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserId } from '@/lib/auth'
import { sql } from '@/lib/db'
import { appTitleSchema, customizationSchema, passkeySchema } from '@/lib/validation'

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const apps = await sql(
      `SELECT id, user_id, template_id, title, customization, passkey, is_public, created_at, updated_at
       FROM apps
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
      [userId]
    )

    return NextResponse.json(
      { apps },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get apps error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch apps' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const title = appTitleSchema.parse(body.title)
    const templateId = body.template_id
    const customization = customizationSchema.parse(body.customization || {})
    const passkey = passkeySchema.parse(body.passkey)

    const appId = crypto.randomUUID()
    const now = new Date()

    const result = await sql(
      `INSERT INTO apps (id, user_id, template_id, title, customization, passkey, is_public, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, user_id, template_id, title, customization, passkey, is_public, created_at, updated_at`,
      [appId, userId, templateId, title, JSON.stringify(customization), passkey, false, now, now]
    )

    return NextResponse.json(
      { app: result[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create app error:', error)
    return NextResponse.json(
      { error: 'Failed to create app' },
      { status: 500 }
    )
  }
}
