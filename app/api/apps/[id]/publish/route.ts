import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function POST(
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
    const { is_published } = await request.json();

    // Verify app belongs to user
    const result = await db.query(
      'SELECT * FROM apps WHERE id = $1 AND creator_id = $2',
      [id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // Update publish status
    const updateResult = await db.query(
      'UPDATE apps SET is_published = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [is_published, id]
    );

    return NextResponse.json({ app: updateResult.rows[0] });
  } catch (error) {
    console.error('Error publishing app:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
