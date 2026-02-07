import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: { passkey: string } }
) {
  try {
    const passkey = (await params).passkey
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

    const appId = apps[0].id
    const responseId = crypto.randomUUID()
    const now = new Date()

    // Save response
    await sql(
      `INSERT INTO app_responses (id, app_id, responses, visitor_name, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        responseId,
        appId,
        JSON.stringify(body.responses || {}),
        body.visitor_name || null,
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
