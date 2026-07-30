'use client';

import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { UserForm } from '../components/UserForm';

import { useCreateUserMutation } from '../hooks/useUsers';

import type { CreateUserFormValues } from '../schemas';

export default function CreateUserPage() {
  const router = useRouter();

  const createUser = useCreateUserMutation();

  const handleSubmit = (values: CreateUserFormValues) => {
    createUser.mutate(values, {
      onSuccess: () => router.push('/users'),
    });
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="mb-3">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <h1 className="text-3xl font-bold">Create User</h1>

          <p className="text-muted-foreground">Create a new user account.</p>
        </div>
      </div>

      <UserForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isSubmitting={createUser.isPending}
      />
    </div>
  );
}
