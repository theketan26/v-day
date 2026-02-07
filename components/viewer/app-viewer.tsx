'use client'

import { useState, useEffect } from 'react'
import { Loader2, Heart } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface AppData {
  id: string
  title: string
  customization: Record<string, unknown>
  template: {
    name: string
    config: Record<string, unknown>
  }
}

interface AppViewerProps {
  passkey: string
}

export function AppViewer({ passkey }: AppViewerProps) {
  const [app, setApp] = useState<AppData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [visitorName, setVisitorName] = useState('')
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        // Initialize responses with template config fields
        if (data.app.template?.config) {
          const initialResponses: Record<string, string> = {}
          Object.keys(data.app.template.config).forEach((key) => {
            initialResponses[key] = ''
          })
          setResponses(initialResponses)
        }
      } catch (error) {
        console.error('Failed to fetch app:', error)
        toast.error('Failed to load app')
      } finally {
        setIsLoading(false)
      }
    }

    fetchApp()
  }, [passkey])

  const handleSubmit = async () => {
    if (!visitorName.trim()) {
      toast.error('Please enter your name')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/public/apps/${passkey}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_name: visitorName,
          responses,
        }),
      })

      if (!response.ok) {
        toast.error('Failed to submit response')
        return
      }

      toast.success('Thank you! Your response has been saved. 💕')
      setVisitorName('')
      setResponses(
        Object.keys(responses).reduce((acc, key) => {
          acc[key] = ''
          return acc
        }, {} as Record<string, string>)
      )
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    )
  }

  if (!app) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">App not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <Heart className="w-12 h-12 text-pink-500 fill-pink-500 mx-auto mb-4 animate-float" />
          <h1 className="text-4xl font-bold text-pink-600 mb-2">
            {app.title}
          </h1>
          <p className="text-gray-600">
            A romantic experience created just for you
          </p>
        </div>

        {/* Content Card */}
        <Card className="border-pink-200 shadow-lg">
          <CardContent className="p-8 space-y-6">
            {/* Custom content from template */}
            {app.customization && Object.entries(app.customization).length > 0 && (
              <div className="space-y-4 mb-6 p-4 bg-pink-100 rounded-lg">
                {Object.entries(app.customization).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-pink-700 font-semibold capitalize">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="text-pink-900">{String(value)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Response Form */}
            <div className="space-y-4 border-t border-pink-100 pt-6">
              <h2 className="text-xl font-semibold">Share Your Response</h2>

              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  disabled={isSubmitting}
                  className="border-pink-200"
                />
              </div>

              {Object.entries(responses).map(([key]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="capitalize">
                    {key.replace(/_/g, ' ')}
                  </Label>
                  <Input
                    id={key}
                    placeholder={`Your ${key.replace(/_/g, ' ')}`}
                    value={responses[key]}
                    onChange={(e) =>
                      setResponses((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    disabled={isSubmitting}
                    className="border-pink-200"
                  />
                </div>
              ))}

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-pink-500 text-white hover:bg-pink-600 mt-6"
              >
                {isSubmitting ? 'Submitting...' : 'Submit My Response'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
