'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Loader2, Save, Eye, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { ImageUpload } from '../ui/image-upload'
import type { Template, CustomizationField, App } from '../../types'

interface TemplateEditorProps {
  appId: string
}

export function TemplateEditor({ appId }: TemplateEditorProps) {
  const router = useRouter()
  const [app, setApp] = useState<App | null>(null)
  const [template, setTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [title, setTitle] = useState('')
  const [passkey, setPasskey] = useState('')
  const [customizations, setCustomizations] = useState<Record<string, string>>({})
  const previewRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const fetchAppAndTemplate = async () => {
      try {
        // Fetch the app
        const appResponse = await fetch(`/api/apps/${appId}`)
        if (!appResponse.ok) {
          toast.error('App not found')
          router.push('/dashboard')
          return
        }
        const appData = await appResponse.json()
        const appDetails = appData.app
        setApp(appDetails)
        setTitle(appDetails.title)
        setPasskey(appDetails.passkey)
        
        const existingCustomizations = typeof appDetails.customizations === 'string'
          ? JSON.parse(appDetails.customizations)
          : appDetails.customizations || {}
        
        // Fetch the template
        const templatesResponse = await fetch('/api/templates')
        const templatesData = await templatesResponse.json()
        const found = templatesData.templates?.find((t: Template) => t.id === appDetails.template_id)
        
        if (found) {
          setTemplate(found)
          
          // Initialize customizations with defaults from template
          const initialCustomizations: Record<string, string> = {}
          found.customization_fields?.forEach((field: CustomizationField) => {
            initialCustomizations[field.key] = existingCustomizations[field.key] || field.default || ''
          })
          setCustomizations(initialCustomizations)
        } else {
          toast.error('Template not found')
        }
      } catch (error) {
        console.error('Failed to fetch app or template:', error)
        toast.error('Failed to load editor')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppAndTemplate()
  }, [appId, router])

  useEffect(() => {
    if (showPreview && template && previewRef.current) {
      renderPreview()
    }
  }, [showPreview, customizations, template])

  const renderPreview = () => {
    if (!template || !previewRef.current) return

    let html = template.html_template
    Object.entries(customizations).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      html = html.replace(regex, value || '')
    })

    const fullHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          ${template.css_template || ''}
        </style>
      </head>
      <body>
        ${html}
        <script>
          ${template.js_template || ''}
        </script>
      </body>
      </html>
    `

    const iframeDoc = previewRef.current.contentDocument || previewRef.current.contentWindow?.document
    if (iframeDoc) {
      iframeDoc.open()
      iframeDoc.write(fullHTML)
      iframeDoc.close()
    }
  }

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
      const response = await fetch(`/api/apps/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          customizations,
          passkey,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || 'Failed to save app')
        return
      }

      toast.success('App saved successfully!')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleFieldChange = (key: string, value: string) => {
    setCustomizations(prev => ({
      ...prev,
      [key]: value
    }))
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

  if (showPreview) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Preview Mode</h2>
          <Button onClick={() => setShowPreview(false)}>
            Close Preview
          </Button>
        </div>
        <iframe
          ref={previewRef}
          className="flex-1 w-full border-0"
          title="Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => router.push('/dashboard')}
            variant="ghost"
            className="gap-2 hover:bg-pink-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="space-y-4">
            <Card className="border-pink-200">
              <CardHeader>
                <CardTitle>Customize Your App</CardTitle>
                <p className="text-sm text-gray-600">Template: {template.name}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Settings */}
                <div className="space-y-4 pb-6 border-b border-pink-100">
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
                </div>

                {/* Template Customization Fields */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Content</h3>
                  {template.customization_fields?.map((field: CustomizationField) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key}>
                        {field.label}
                      </Label>
                      {field.type === 'textarea' ? (
                        <textarea
                          id={field.key}
                          value={customizations[field.key] || ''}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          placeholder={field.default}
                          className="w-full min-h-32 px-3 py-2 border border-pink-200 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 resize-y"
                        />
                      ) : field.type === 'image' ? (
                        <ImageUpload
                          value={customizations[field.key] || ''}
                          onChange={(url) => handleFieldChange(field.key, url)}
                        />
                      ) : (
                        <Input
                          id={field.key}
                          type={field.type}
                          value={customizations[field.key] || ''}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          placeholder={field.default}
                          className="border-pink-200"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-pink-100">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-pink-500 text-white hover:bg-pink-600"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowPreview(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview Panel */}
          <div className="hidden lg:block">
            <Card className="border-pink-200 sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="text-center p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Your customized template will appear here
                    </p>
                    <Button 
                      onClick={() => setShowPreview(true)}
                      size="sm"
                      className="bg-pink-500 text-white hover:bg-pink-600"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Full Preview
                    </Button>
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