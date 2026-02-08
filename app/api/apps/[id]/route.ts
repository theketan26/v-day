import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserId } from '../../../../lib/auth'
import { sql } from '../../../../lib/db'
import { customizationSchema, updateAppSchema } from '../../../../lib/validation'
import type { App, UpdateAppRequest } from '../../../../types'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
       WHERE id = $1 AND creator_id = $2`,
      [(await params).id, userId]
    )

    if (apps.length === 0) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { app: apps[0] },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get app error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch app' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = updateAppSchema.parse(body)
    const now = new Date()

    const result = await sql(
      `UPDATE apps
       SET customizations = $1, title = COALESCE($2, title), updated_at = $3, passkey = $6
       WHERE id = $4 AND creator_id = $5
       RETURNING id, creator_id, template_id, title, customizations, passkey, is_published, created_at, updated_at`,
      [JSON.stringify(validatedData.customizations || {}), validatedData.title, now, (await params).id, userId, validatedData.passkey]
    )

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { app: result[0] },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update app error:', error)
    return NextResponse.json(
      { error: 'Failed to update app' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthUserId()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await sql(
      `DELETE FROM apps WHERE id = $1 AND creator_id = $2`,
      [(await params).id, userId]
    )

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete app error:', error)
    return NextResponse.json(
      { error: 'Failed to delete app' },
      { status: 500 }
    )
  }
}
