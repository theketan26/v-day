import { NextRequest, NextResponse } from 'next/server'
import { getAuthUserId } from '@/lib/auth'
import { sql } from '@/lib/db'
import { customizationSchema } from '@/lib/validation'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
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
      `SELECT id, user_id, template_id, title, customization, passkey, is_public, created_at, updated_at
       FROM apps
       WHERE id = $1 AND user_id = $2`,
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
  { params }: { params: { id: string } }
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
    const customization = customizationSchema.parse(body.customization)
    const now = new Date()

    const result = await sql(
      `UPDATE apps
       SET customization = $1, updated_at = $2
       WHERE id = $3 AND user_id = $4
       RETURNING id, user_id, template_id, title, customization, passkey, is_public, created_at, updated_at`,
      [JSON.stringify(customization), now, (await params).id, userId]
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
  { params }: { params: { id: string } }
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
      `DELETE FROM apps WHERE id = $1 AND user_id = $2`,
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
