'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateResourceMutation } from '../hooks/useResources';
import { CreateResourceForm } from '../components/CreateResourceForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

export const CreateResourcePage: React.FC = () => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createResource } = useCreateResourceMutation();

  const handleSubmit = (values: any) => {
    setIsSubmitting(true);

    // Add creatorId from current user if available
    const submissionData = {
      ...values,
      creatorId: currentUser?.id || values.creatorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      downloads: 0,
    };

    createResource(submissionData as any, {
      onSuccess: (newResource) => {
        setIsSubmitting(false);
        toast.success(`Resource "${newResource.title}" created successfully!`);
        router.push('/resources');
      },
      onError: (error: any) => {
        setIsSubmitting(false);
        toast.error(error.message || 'Failed to create resource');
      },
    });
  };

  const handleCancel = () => {
    router.push('/resources');
  };

  return (
    <div className="animate-fade-in space-y-6 p-6">
      {/* Back navigation */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handleCancel} className="h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Create New Resource</h1>
          <p className="text-muted-foreground text-sm font-medium">
            Add educational materials, templates, or digital downloads to the platform.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
        <CreateResourceForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          defaultValues={{
            creatorId: currentUser?.id || '',
          }}
        />
      </div>
    </div>
  );
};

export default CreateResourcePage;
