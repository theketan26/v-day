import { NextResponse } from 'next/server'
import { sql } from '../../../lib/db'
import type { Template } from '../../../types'

export async function GET() {
  try {
    const templates = await sql(
      `SELECT id, name, description, theme, html_template, css_template, js_template, thumbnail_url, customization_fields, is_public, created_at, updated_at
       FROM templates
       WHERE is_public = true
       ORDER BY created_at DESC`
    )

    return NextResponse.json(
      { templates },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get templates error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}
