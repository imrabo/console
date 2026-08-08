"use client";

import React from "react";
import { ConnectorForm } from "./ConnectorForm";
import type { CreateConnectorFormValues } from "../schemas";

interface CreateConnectorFormProps {
  onSubmit: (values: CreateConnectorFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CreateConnectorFormValues>;
}

// Backward compatible wrapper for existing usage
export const CreateConnectorForm: React.FC<CreateConnectorFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues = {},
}) => {
  return (
    <ConnectorForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      defaultValues={defaultValues}
      isEditMode={false}
    />
  );
};

export default CreateConnectorForm;
