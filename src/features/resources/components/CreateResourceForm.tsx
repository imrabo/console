'use client';

import React from 'react';
import { ResourceForm } from './ResourceForm';
import type { CreateResourceFormValues } from '../schemas';

interface CreateResourceFormProps {
  onSubmit: (values: CreateResourceFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CreateResourceFormValues>;
}

// Backward compatible wrapper for existing usage
export const CreateResourceForm: React.FC<CreateResourceFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues = {},
}) => {
  return (
    <ResourceForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      defaultValues={defaultValues}
      isEditMode={false}
    />
  );
};

export default CreateResourceForm;
