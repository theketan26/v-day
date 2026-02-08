import { AppViewer } from '../../../components/viewer/app-viewer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Romantic App - Romantic Apps',
  description: 'View and interact with a romantic experience',
}

export default async function ViewPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  return <AppViewer passkey={params.id} />
}
