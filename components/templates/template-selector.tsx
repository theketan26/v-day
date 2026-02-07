'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Loader2 } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string
  config: Record<string, unknown>
}

export function TemplateSelector() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates')
        const data = await response.json()
        setTemplates(data.templates || [])
      } catch (error) {
        console.error('Failed to fetch templates:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No templates available yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="hover:shadow-lg transition-shadow border-pink-100">
          <CardHeader className="pb-3">
            <div className="aspect-video rounded-lg bg-gradient-romantic-light mb-4 flex items-center justify-center">
              <Heart className="w-10 h-10 text-pink-500 fill-pink-500" />
            </div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/editor/${template.id}`}>
              <Button className="w-full bg-gradient-romantic text-white hover:opacity-90">
                Create with this template
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
