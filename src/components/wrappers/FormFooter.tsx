'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

export interface FormFooterProps {
  submitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  submitDisabled?: boolean;
  onCancel?: () => void;
}

export function FormFooter({
  submitting = false,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  submitDisabled = false,
  onCancel,
}: FormFooterProps) {
  return (
    <div className="flex w-full items-center justify-end gap-3">
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          {cancelLabel}
        </Button>
      )}

      <Button type="submit" disabled={submitting || submitDisabled}>
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

        {submitting ? 'Saving...' : submitLabel}
      </Button>
    </div>
  );
}

export default FormFooter;
