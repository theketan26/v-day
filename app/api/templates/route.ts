import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const templates = await sql(
      `SELECT id, name, description, category, thumbnail, config, created_at
       FROM templates
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
