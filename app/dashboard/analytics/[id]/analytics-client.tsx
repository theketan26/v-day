'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

// Type definitions
export type AnalyticsLog = {
    id: string
    session_id: string
    event_type: string
    event_data: any
    created_at: string
    visitor_name: string | null
    visitor_email: string | null
    visitor_phone: string | null
}

export type SessionGroup = {
    sessionId: string
    visitorName: string | null
    visitorEmail: string | null
    visitorPhone: string | null
    startTime: Date
    events: AnalyticsLog[]
}

export function AnalyticsClient({ sessions }: { sessions: SessionGroup[] }) {
    const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({})

    const toggleSession = (sessionId: string) => {
        setExpandedSessions((prev) => ({
            ...prev,
            [sessionId]: !prev[sessionId]
        }))
    }

    const formatEventData = (event: AnalyticsLog) => {
        if (event.event_type === 'click') {
            return (
                <span className="text-gray-700">
                    Clicked on: <strong className="text-pink-600">{event.event_data?.text || event.event_data?.tagName || 'Button'}</strong>
                </span>
            )
        }

        if (event.event_type === 'input') {
            return (
                <span className="text-gray-700">
                    Input <strong className="text-pink-600">{event.event_data?.name || 'Field'}</strong> set to: <em className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">"{event.event_data?.value}"</em>
                </span>
            )
        }

        if (event.event_type === 'page_load') {
            const timeLoaded = new Date(event.created_at).toLocaleTimeString()
            return (
                <span className="text-gray-700">
                    Page loaded at <strong>{timeLoaded}</strong>
                </span>
            )
        }

        if (event.event_type === 'page_unload') {
            const timeSpentSecs = Math.round((event.event_data?.timeSpentMs || 0) / 1000)
            return (
                <span className="text-gray-700">
                    Page unloaded (Time spent: <strong>{timeSpentSecs} seconds</strong>)
                </span>
            )
        }

        // Fallback for unknown events
        return <pre className="text-xs bg-gray-50 p-2 rounded truncate max-w-sm">{JSON.stringify(event.event_data)}</pre>
    }

    if (sessions.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                No analytics data available yet. Share your app to start receiving interactions.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {sessions.map((session) => {
                const isExpanded = !!expandedSessions[session.sessionId]
                const hasVisitorInfo = !!(session.visitorName || session.visitorEmail || session.visitorPhone)

                return (
                    <div key={session.sessionId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => toggleSession(session.sessionId)}
                            className="w-full flex items-center justify-between p-5 bg-gradient-to-r hover:from-pink-50 hover:to-white transition-colors text-left"
                        >
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                                    Session: {session.sessionId.substring(0, 8)}...
                                    {hasVisitorInfo && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200 uppercase tracking-wide">
                                            Verified User
                                        </span>
                                    )}
                                </span>
                                <span className="text-sm text-gray-500 mt-1">
                                    Started at {session.startTime.toLocaleString()} • {session.events.length} events
                                </span>
                            </div>
                            <div className="text-gray-400">
                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </button>

                        {isExpanded && (
                            <div className="p-5 border-t border-gray-100 bg-gray-50/50">
                                {hasVisitorInfo && (
                                    <div className="mb-6 p-4 bg-white rounded-lg border border-pink-100 shadow-sm">
                                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Visitor Details (Passkey)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <span className="block text-xs text-gray-500 mb-1">Name</span>
                                                <span className="font-medium text-gray-800">{session.visitorName || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-gray-500 mb-1">Email</span>
                                                <span className="font-medium text-gray-800">{session.visitorEmail || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-gray-500 mb-1">Phone</span>
                                                <span className="font-medium text-gray-800">{session.visitorPhone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Activity Timeline</h4>
                                <div className="space-y-3">
                                    {session.events.map((event, idx) => (
                                        <div key={event.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-white border border-gray-100 rounded-lg">
                                            <div className="flex items-center gap-3 min-w-[140px]">
                                                <span className="text-xs text-gray-400 font-mono">
                                                    {new Date(event.created_at).toLocaleTimeString([], { hour12: false })}
                                                </span>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 uppercase">
                                                    {event.event_type}
                                                </span>
                                            </div>
                                            <div className="flex-1 text-sm">
                                                {formatEventData(event)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
