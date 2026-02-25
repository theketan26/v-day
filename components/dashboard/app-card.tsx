'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Copy, Trash2, Eye, EyeOff, Edit, Share2, Upload } from 'lucide-react';
import type { App } from '../../types';
import flowerHeartSVG from '../../assets/flower-heart.svg';
import flowerLotusSVG from '../../assets/flower-lotussvg.svg';
import flowerSunflowerSVG from '../../assets/flower-subflower.svg';
import flowerTulipSVG from '../../assets/flower-tulip.svg';
import { FlowerHeartIcon } from '../icons/flower-heart';
import { FlowerLotusIcon } from '../icons/flower-lotussvg';
import { FlowerSunflowerIcon } from '../icons/flower-sunflower';
import { FlowerTulipIcon } from '../icons/flower-tulip';
import { randomInt } from 'crypto';

interface AppCardProps {
  app: App;
  onDeleted: (appId: string) => void;
  onPublished?: (appId: string) => void;
}

export default function AppCard({ app, onDeleted, onPublished }: AppCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPasskeyVisible, setIsPasskeyVisible] = useState(false);

  const publicUrl = `${window.location.origin}/view-app/${app.id}`;

  const getMaskedPasskey = (passkey: string) => {
    return '*'.repeat(passkey.length);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPasskey = () => {
    navigator.clipboard.writeText(app.passkey);
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

  const getRandomClassNames = () => {
    const bgClasses = [
      "h-full -rotate-45 absolute -bottom-20 -right-80 text-rose-200/50 z-0 pointer-events-none",
      "h-full rotate-12 absolute -top-16 -left-60 text-pink-200/50 z-0 pointer-events-none",
      "h-full rotate-12 absolute text-pink-200/50 z-0 pointer-events-none top-6 right-0",
      "h-full -rotate-12 absolute text-pink-200/50 z-0 pointer-events-none top-6 -left-24"
    ];
    const randomIndex = Math.floor(Math.random() * bgClasses.length);
    return bgClasses[randomIndex];
  }

  const getRandomFlower = () => {
    const flowers = [
      <FlowerHeartIcon className={getRandomClassNames()} />,
      <FlowerLotusIcon className={getRandomClassNames()} />,
      <FlowerSunflowerIcon className={getRandomClassNames()} />,
      <FlowerTulipIcon className={getRandomClassNames()} />
    ];
    const randomIndex = Math.floor(Math.random() * flowers.length);
    return flowers[randomIndex];
  };

  return (
    <Card className="hover:shadow-lg hover:scale-105 transition-all duration-500 hover:shadow-rose-200 relative overflow-hidden">
      {/* Background SVG */}
      {getRandomFlower()}

      <CardHeader className="relative z-10">
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
      <CardContent className="relative z-10">
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

          {/* Passkey */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Passkey</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={isPasskeyVisible ? app.passkey : getMaskedPasskey(app.passkey)}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-gray-100 rounded border border-gray-300 text-gray-600"
              />
              <Button
                variant="outline"
                onClick={() => setIsPasskeyVisible(!isPasskeyVisible)}
                className="gap-2"
                title={isPasskeyVisible ? 'Hide passkey' : 'Show passkey'}
              >
                {isPasskeyVisible ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleCopyPasskey}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Link href={`/editor/${app.id}`} className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </Link>
            <Link href={`/view-app/${app.id}`} className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </Link>
            {!app.is_published && (
              <Button
                onClick={handlePublish}
                disabled={isPublishing}
                className="gap-2 bg-green-500 text-white hover:bg-green-600"
              >
                <Upload className="w-4 h-4" />
                {isPublishing ? 'Publishing...' : 'Publish'}
              </Button>
            )}
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
