'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
}

interface App {
  id: string;
  title: string;
  template_id: string;
  slug: string;
  passkey: string;
  is_published: boolean;
  created_at: string;
}

interface NewAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppCreated: (app: App) => void;
}

export default function NewAppModal({ isOpen, onClose, onAppCreated }: NewAppModalProps) {
  const [step, setStep] = useState<'select-template' | 'name'>('select-template');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [appTitle, setAppTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep('name');
  };

  const handleCreateApp = async () => {
    if (!appTitle.trim() || !selectedTemplate) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: appTitle,
          template_id: selectedTemplate,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onAppCreated(data.app);
        handleReset();
      }
    } catch (error) {
      console.error('Error creating app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('select-template');
    setSelectedTemplate('');
    setAppTitle('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="max-w-2xl w-full mx-4">
        <DialogHeader>
          <DialogTitle>Create a New Romantic App</DialogTitle>
          <DialogDescription>
            {step === 'select-template'
              ? 'Choose a template to get started'
              : 'Give your app a title'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 px-6">
          {step === 'select-template' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(template => (
                <Card
                  key={template.id}
                  className="p-4 cursor-pointer hover:border-pink-300 hover:shadow-lg transition-all border-pink-100"
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="app-title">App Title</Label>
                <Input
                  id="app-title"
                  placeholder="e.g., Our Love Story, Will You Marry Me?"
                  value={appTitle}
                  onChange={e => setAppTitle(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleCreateApp()}
                  autoFocus
                />
              </div>
              <p className="text-sm text-gray-600">
                This title will be used in your app and help you organize your creations.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-200">
          <Button variant="outline" onClick={handleReset}>
            {step === 'name' ? 'Back' : 'Cancel'}
          </Button>
          {step === 'select-template' ? (
            <Button disabled className="bg-gray-300 text-gray-500">
              Next
            </Button>
          ) : (
            <Button onClick={handleCreateApp} disabled={!appTitle.trim() || isLoading} className="bg-pink-500 text-white hover:bg-pink-600">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create App
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
