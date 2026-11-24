'use client';

import { useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { UserForm } from '../components/UserForm';

import type { EditUserFormValues } from '../schemas';
import { useRestoreUserMutation, useUpdateUserMutation, useUserQuery } from '../hooks/useUsers';

export default function EditUserPage() {
  const navigate = useNavigate();
  const params = useParams();

  const userId = params.id as string;

  const { data: user, isLoading, isError, error, refetch } = useUserQuery(userId);
  const updateUser = useUpdateUserMutation();
  const restoreUser = useRestoreUserMutation();
  const formDefaults = useMemo(() => {
    if (!user) return undefined;
    const cleanedPhone = user.phoneNumber?.replace(/\D/g, '') ?? '';
    return {
      fullName: user.fullName,
      email: user.email,
      countryCode: cleanedPhone.length > 10 ? cleanedPhone.slice(0, -10) : '91',
      phoneNumber: cleanedPhone.slice(-10),
      membershipType: user.membershipType,
      isActive: user.isActive,
      isExpert: user.isExpert,
      gender: user.gender,
      profileImageUrl: user.profileImageUrl,
    };
  }, [user]);

  const handleSubmit = async (values: EditUserFormValues) => {
    try {
      await updateUser.mutateAsync({
        id: userId,
        data: values,
      });
      navigate('/users');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRestore = () => {
    restoreUser.mutate(userId, {
      onSuccess: () => {
        navigate('/users');
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center">Loading user...</div>;
  }

  if (isError) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-destructive font-medium">Unable to load user for editing.</p>
        <p className="text-muted-foreground text-sm">
          {error instanceof Error ? error.message : 'Please try again.'}
        </p>
        <Button variant="outline" onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-3"
              disabled={updateUser.isPending || restoreUser.isPending}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <h1 className="text-3xl font-bold">Edit User</h1>

            <p className="text-muted-foreground">{user.fullName}</p>
          </div>

          {user.isDeleted ? (
            <Button variant="secondary" onClick={handleRestore} disabled={restoreUser.isPending}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Restore User
            </Button>
          ) : null}
        </div>
      </div>

      <UserForm
        mode="edit"
        defaultValues={formDefaults}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        isSubmitting={updateUser.isPending}
      />
    </div>
  );
}
