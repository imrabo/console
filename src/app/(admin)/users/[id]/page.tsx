'use client';

import { useParams, useRouter } from 'next/navigation';

import {
  useUserQuery,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
} from '@/features/users/hooks/useUsers';

import { UserDetailsPage } from '@/features/users/pages/UserDetailsPage';

import { useAuth } from '@/providers/AuthProvider';

export default function Page() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();

  const { user: currentAdmin } = useAuth();

  const { data, isLoading } = useUserQuery(id);

  const deleteUser = useDeleteUserMutation();

  const updateStatus = useUpdateUserStatusMutation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>User not found.</div>;
  }

  return (
    <UserDetailsPage
      user={data}
      onEdit={() => router.push(`/users/${id}/edit`)}
      onDelete={() => deleteUser.mutate(id)}
      onSuspend={function (): void {
        throw new Error('Function not implemented.');
      }}
      onActivate={function (): void {
        throw new Error('Function not implemented.');
      }}
    />
  );
}
