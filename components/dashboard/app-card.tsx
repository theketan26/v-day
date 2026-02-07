'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Eye, Edit, Share2 } from 'lucide-react';

interface App {
  id: string;
  title: string;
  template_id: string;
  slug: string;
  passkey: string;
  is_published: boolean;
  created_at: string;
}

interface AppCardProps {
  app: App;
  onDeleted: (appId: string) => void;
}

export default function AppCard({ app, onDeleted }: AppCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const publicUrl = `${window.location.origin}/view/${app.passkey}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this app?')) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/apps/${app.id}`, { method: 'DELETE' });
      if (response.ok) {
        onDeleted(app.id);
      }
    } catch (error) {
      console.error('Error deleting app:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{app.title}</CardTitle>
            <CardDescription className="mt-1">
              Created {new Date(app.created_at).toLocaleDateString()}
            </CardDescription>
          </div>
          {app.is_published && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
              Published
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Share Link */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Share Link</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={publicUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-muted rounded border text-muted-foreground"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Link href={`/editor/${app.id}`} className="flex-1">
              <Button size="sm" variant="outline" className="w-full gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </Link>
            <Link href={`/view/${app.passkey}`} className="flex-1">
              <Button size="sm" variant="outline" className="w-full gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
