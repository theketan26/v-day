import { TemplateEditor } from '@/components/editor/template-editor'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Your App - Romantic Apps',
  description: 'Customize and create your romantic app',
}

export default async function EditorPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  return <TemplateEditor templateId={params.id} />
}
