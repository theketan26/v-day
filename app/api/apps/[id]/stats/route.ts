import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '../../../../../lib/db';
import { getAuthUser } from '../../../../../lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify app belongs to user
    const appResult = await sql(
      'SELECT * FROM apps WHERE id = $1 AND creator_id = $2',
      [id, user.id]
    );

    if (appResult.length === 0) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // Get response count
    const statsResult = await sql(
      `SELECT 
        COUNT(*) as total_responses,
        COUNT(DISTINCT visitor_id) as unique_visitors
      FROM app_responses 
      WHERE app_id = $1`,
      [id]
    );

    const stats = statsResult[0];

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
