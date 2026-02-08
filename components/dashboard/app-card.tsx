'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Copy, Trash2, Eye, Edit, Share2, Upload } from 'lucide-react';
import type { App } from '../../types';

interface AppCardProps {
  app: App;
  onDeleted: (appId: string) => void;
  onPublished?: (appId: string) => void;
}

export default function AppCard({ app, onDeleted, onPublished }: AppCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const publicUrl = `${window.location.origin}/view-app/${app.id}`;

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

  const handlePublish = async () => {
    if (!confirm('Are you sure you want to publish this app? It will be visible to anyone with the link.')) return;
    
    setIsPublishing(true);
    try {
      const response = await fetch(`/api/apps/${app.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: true })
      });
      if (response.ok) {
        onPublished?.(app.id);
      }
    } catch (error) {
      console.error('Error publishing app:', error);
    } finally {
      setIsPublishing(false);
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
            <p className="text-sm font-medium text-gray-600 mb-2">Share Link</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={publicUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-gray-100 rounded border border-gray-300 text-gray-600"
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
            <Link href={`/view-app/${app.id}`} className="flex-1">
              <Button size="sm" variant="outline" className="w-full gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </Link>
            {!app.is_published && (
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={isPublishing}
                className="gap-2 bg-green-500 text-white hover:bg-green-600"
              >
                <Upload className="w-4 h-4" />
                {isPublishing ? 'Publishing...' : 'Publish'}
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2 bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
