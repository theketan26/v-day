'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface Template {
  id: string
  name: string
  description: string
  config: Record<string, unknown>
}

interface TemplateEditorProps {
  templateId: string
}

export function TemplateEditor({ templateId }: TemplateEditorProps) {
  const router = useRouter()
  const [template, setTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [passkey, setPasskey] = useState('')
  const [customization, setCustomization] = useState<Record<string, unknown>>({})

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch('/api/templates')
        const data = await response.json()
        const found = data.templates?.find((t: Template) => t.id === templateId)
        if (found) {
          setTemplate(found)
          setCustomization(found.config || {})
        }
      } catch (error) {
        console.error('Failed to fetch template:', error)
        toast.error('Failed to load template')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplate()
  }, [templateId])

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }
    if (!passkey.trim()) {
      toast.error('Please set a passkey')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          template_id: templateId,
          customization,
          passkey,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || 'Failed to save app')
        return
      }

      const data = await response.json()
      toast.success('App created successfully!')
      router.push(`/dashboard`)
    } catch (error) {
      console.error('Save error:', error)
      toast.error('An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    )
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Template not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="space-y-4">
            <Card className="border-pink-200">
              <CardHeader>
                <CardTitle>Create Your App</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">App Title</Label>
                  <Input
                    id="title"
                    placeholder="Give your app a name..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-pink-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passkey">Passkey</Label>
                  <Input
                    id="passkey"
                    placeholder="Set a passkey to share..."
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    className="border-pink-200"
                  />
                  <p className="text-xs text-gray-500">
                    Only people with this passkey can access your app
                  </p>
                </div>

                <div className="space-y-4 border-t border-pink-100 pt-6">
                  <h3 className="font-semibold">Customization</h3>
                  {Object.entries(customization).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="text-sm capitalize">
                        {key.replace(/_/g, ' ')}
                      </Label>
                      <Input
                        id={key}
                        defaultValue={String(value)}
                        onChange={(e) =>
                          setCustomization((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="border-pink-200"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-6 border-t border-pink-100">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-gradient-romantic text-white hover:opacity-90"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save & Create
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="hidden lg:block">
            <Card className="border-pink-200 sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-romantic-light rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-pink-700 mb-2">
                      {title || 'Your App Title'}
                    </h2>
                    <p className="text-sm text-pink-600">
                      {passkey || 'Your passkey'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
