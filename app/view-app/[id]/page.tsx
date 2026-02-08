import { AppViewerWithPasskey } from '../../../components/viewer/app-viewer-with-passkey'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Romantic App - Romantic Apps',
  description: 'View and interact with a romantic experience',
}

export default async function ViewAppPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  return <AppViewerWithPasskey appId={params.id} />
}
