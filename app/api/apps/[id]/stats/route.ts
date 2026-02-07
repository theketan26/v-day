import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifySession(sessionId);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Verify app belongs to user
    const appResult = await db.query(
      'SELECT * FROM apps WHERE id = $1 AND creator_id = $2',
      [id, user.id]
    );

    if (appResult.rows.length === 0) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // Get response count
    const statsResult = await db.query(
      `SELECT 
        COUNT(*) as total_responses,
        COUNT(DISTINCT visitor_id) as unique_visitors
      FROM app_responses 
      WHERE app_id = $1`,
      [id]
    );

    const stats = statsResult.rows[0];

    return NextResponse.json({
      stats: {
        total_responses: parseInt(stats.total_responses),
        unique_visitors: parseInt(stats.unique_visitors),
      },
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
