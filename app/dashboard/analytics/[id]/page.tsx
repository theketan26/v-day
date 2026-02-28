import { getAuthUserId } from '../../../../lib/auth'
import { sql } from '../../../../lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Activity, User, Grid } from 'lucide-react'

import { AnalyticsClient, AnalyticsLog, SessionGroup } from './analytics-client'

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const userId = await getAuthUserId()
    if (!userId) {
        redirect('/login')
    }

    const { id } = await params;

    // Verify the app belongs to the user
    const appRes = await sql`
    SELECT id, title FROM apps WHERE id = ${id} AND creator_id = ${userId}
  `
    if (appRes.length === 0) {
        redirect('/dashboard')
    }
    const app = appRes[0]

    // Fetch the analytics logs joined with app_view_logs to include visitor data
    const logs = await sql`
    SELECT 
      a.id, a.session_id, a.event_type, a.event_data, a.created_at,
      v.visitor_name, v.visitor_email, v.visitor_phone
    FROM analytics_logs a
    LEFT JOIN app_view_logs v ON a.session_id::text = v.id::text
    WHERE a.app_id = ${id}
    ORDER BY a.created_at ASC
    LIMIT 1000
  `

    // Group logs by session_id
    const sessionsMap = new Map<string, SessionGroup>()

    for (const log of logs) {
        if (!sessionsMap.has(log.session_id)) {
            sessionsMap.set(log.session_id, {
                sessionId: log.session_id,
                visitorName: log.visitor_name,
                visitorEmail: log.visitor_email,
                visitorPhone: log.visitor_phone,
                startTime: new Date(log.created_at),
                events: []
            })
        }

        const session = sessionsMap.get(log.session_id)!
        session.events.push(log as AnalyticsLog)

        // Ensure startTime is the earliest event
        if (new Date(log.created_at) < session.startTime) {
            session.startTime = new Date(log.created_at)
        }
    }

    // Sort sessions descending by start time
    const sessionGroups = Array.from(sessionsMap.values()).sort(
        (a, b) => b.startTime.getTime() - a.startTime.getTime()
    )

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                                Analytics Details
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">{app.title} - Analytics</h2>
                    <p className="text-gray-600">Review the interactions and behavior of users viewing your application.</p>
                </div>

                <AnalyticsClient sessions={sessionGroups} />
            </main>
        </div>
    )
}
