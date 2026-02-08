import { NextRequest, NextResponse } from 'next/server'
import { sql } from '../../../../../../lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const appId = (await params).id
    const body = await req.json()
    
    const { 
      visitor_name, 
      visitor_email, 
      visitor_phone,
      os,
      browser,
      device_type,
      user_agent
    } = body

    if (!visitor_name) {
      return NextResponse.json(
        { error: 'Visitor name is required' },
        { status: 400 }
      )
    }

    // Get IP address
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || null

    // Insert log
    await sql(
      `INSERT INTO app_view_logs 
        (app_id, visitor_name, visitor_email, visitor_phone, os, browser, device_type, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        appId,
        visitor_name,
        visitor_email || null,
        visitor_phone || null,
        os || null,
        browser || null,
        device_type || null,
        ip,
        user_agent || null
      ]
    )

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logging error:', error)
    return NextResponse.json(
      { error: 'Failed to log view' },
      { status: 500 }
    )
  }
}
