'use client';

import { useNavigate } from 'react-router-dom';

import { UserForm } from '../components/UserForm';

import { useCreateUserMutation } from '../hooks/useUsers';
import type { CreateUserFormValues } from '../schemas';

import PageWrapper from '@/components/wrappers/PageWrapper';

export default function CreateUserPage() {
  const navigate = useNavigate();

  const createUser = useCreateUserMutation();

  const handleSubmit = async (values: CreateUserFormValues) => {
    try {
      await createUser.mutateAsync(values);

      navigate('/users');
    } catch (error) {
      console.error('❌ USER CREATION ERROR:', error);
    }
  };

  return (
    <PageWrapper>
      <UserForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        isSubmitting={createUser.isPending}
      />
    </PageWrapper>
  );
}
