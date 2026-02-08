import { TemplateSelector } from '../../components/templates/template-selector'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Choose Template - Romantic Apps',
  description: 'Select from beautiful romantic templates to create your custom app.',
}

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">
            Choose Your Template
          </h1>
          <p className="text-gray-600">
            Select one of our beautiful romantic templates to get started
          </p>
        </div>
        <TemplateSelector />
      </div>
    </div>
  )
}
