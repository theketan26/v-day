import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserId } from '../../../lib/auth'
import { sql } from '../../../lib/db'
import { appTitleSchema, customizationSchema, passkeySchema, createAppSchema } from '../../../lib/validation'
import type { App, CreateAppRequest } from '../../../types'

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
      `SELECT id, creator_id, template_id, title, customizations, passkey, is_published, created_at, updated_at
       FROM apps
       WHERE creator_id = $1
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
    const validatedData = createAppSchema.parse(body)

    const appId = crypto.randomUUID()
    const slug = validatedData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const passkey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const now = new Date()

    const result = await sql(
      `INSERT INTO apps (id, creator_id, template_id, title, slug, passkey, customizations, is_published, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, creator_id, template_id, title, slug, passkey, customizations, is_published, created_at, updated_at`,
      [appId, userId, validatedData.template_id, validatedData.title, slug, passkey, JSON.stringify(validatedData.customizations), false, now, now]
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
