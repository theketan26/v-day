'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Template } from '../../types'

interface AppData {
  id: string
  title: string
  customizations: Record<string, string>
  template: Template
}

interface AppViewerProps {
  passkey: string
}

export function AppViewer({ passkey }: AppViewerProps) {
  const [app, setApp] = useState<AppData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const response = await fetch(`/api/public/apps/${passkey}`)
        if (!response.ok) {
          toast.error('App not found')
          return
        }
        const data = await response.json()
        setApp(data.app)
      } catch (error) {
        console.error('Failed to fetch app:', error)
        toast.error('Failed to load app')
      } finally {
        setIsLoading(false)
      }
    }

    fetchApp()
  }, [passkey])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    )
  }

  if (!app) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <p className="text-gray-600">App not found</p>
      </div>
    )
  }

  return (
    <iframe
      src={`/api/render/${app.id}`}
      className="w-full h-screen border-0"
      title={app.title}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
  )
}
