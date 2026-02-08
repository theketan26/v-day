import { NextRequest, NextResponse } from 'next/server'
import { sql } from '../../../../../../lib/db'
import { appResponseSchema } from '../../../../../../lib/validation'
import type { AppResponse } from '../../../../../../types'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const passkey = (await params).id
    const body = await req.json()

    // Find the app
    const apps = await sql(
      `SELECT id FROM apps WHERE passkey = $1`,
      [passkey]
    )

    if (apps.length === 0) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      )
    }

    const validatedData = appResponseSchema.parse(body)

    const appId = apps[0].id
    const responseId = crypto.randomUUID()
    const now = new Date()

    // Save response
    await sql(
      `INSERT INTO app_responses (id, app_id, visitor_id, screen_index, response_data, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        responseId,
        appId,
        validatedData.visitor_id || null,
        validatedData.screen_index || null,
        JSON.stringify(validatedData.response_data || {}),
        now,
      ]
    )

    return NextResponse.json(
      { success: true, responseId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Submit response error:', error)
    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    )
  }
}
