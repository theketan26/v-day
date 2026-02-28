import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../../lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { appId, sessionId, eventType, eventData } = body;

        if (!appId || !sessionId || !eventType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await sql`
      INSERT INTO analytics_logs (app_id, session_id, event_type, event_data)
      VALUES (${appId}, ${sessionId}, ${eventType}, ${JSON.stringify(eventData || {})})
    `;

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Analytics tracking error:', error);
        return NextResponse.json({ error: 'Failed to record analytics' }, { status: 500 });
    }
}
