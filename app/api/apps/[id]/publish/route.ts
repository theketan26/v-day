import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '../../../../../lib/db';
import { getAuthUser } from '../../../../../lib/auth';
import { publishAppSchema } from '../../../../../lib/validation';
import type { PublishAppRequest } from '../../../../../types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('auth_session')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = publishAppSchema.parse(body);

    // Verify app belongs to user
    const result = await sql(
      'SELECT * FROM apps WHERE id = $1 AND creator_id = $2',
      [id, user.id]
    );

    if (result.length === 0) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // Update publish status
    const updateResult = await sql(
      'UPDATE apps SET is_published = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [validatedData.is_published, id]
    );

    return NextResponse.json({ app: updateResult[0] });
  } catch (error) {
    console.error('Error publishing app:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
