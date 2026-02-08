import { NextRequest, NextResponse } from 'next/server'
import { clearAuthSession } from '../../../../lib/auth'

export async function POST(req: NextRequest) {
  try {
    await clearAuthSession()

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
