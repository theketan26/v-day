'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, LogOut } from 'lucide-react';
import AppCard from './app-card';
import NewAppModal from './new-app-modal';

interface App {
  id: string;
  title: string;
  template_id: string;
  slug: string;
  passkey: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await fetch('/api/apps');
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch apps');
        }
        const data = await response.json();
        setApps(data.apps || []);
      } catch (error) {
        console.error('Error fetching apps:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApps();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleAppCreated = (newApp: App) => {
    setApps([newApp, ...apps]);
    setShowNewAppModal(false);
  };

  const handleAppDeleted = (appId: string) => {
    setApps(apps.filter(app => app.id !== appId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Romantic Apps</h1>
            <p className="text-gray-600">Create and manage your personalized romantic experiences</p>
          </div>
          <Button variant="outline" size="lg" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Create New App Button */}
        <div className="mb-8">
          <Button size="lg" onClick={() => setShowNewAppModal(true)} className="gap-2 bg-pink-500 text-white hover:bg-pink-600">
            <Plus className="w-5 h-5" />
            Create New App
          </Button>
        </div>

        {/* Apps Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : apps.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No apps yet</CardTitle>
              <CardDescription>Create your first romantic app to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowNewAppModal(true)} className="gap-2 bg-pink-500 text-white hover:bg-pink-600">
                <Plus className="w-4 h-4" />
                Create Your First App
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map(app => (
              <AppCard
                key={app.id}
                app={app}
                onDeleted={handleAppDeleted}
              />
            ))}
          </div>
        )}
      </div>

      {/* New App Modal */}
      <NewAppModal
        isOpen={showNewAppModal}
        onClose={() => setShowNewAppModal(false)}
        onAppCreated={handleAppCreated}
      />
    </div>
  );
}
