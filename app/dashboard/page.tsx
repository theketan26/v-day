import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Dashboard from '@/components/dashboard/dashboard';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) {
    redirect('/login');
  }

  return <Dashboard />;
}
