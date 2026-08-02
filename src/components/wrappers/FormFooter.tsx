import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

interface FormFooterProps<T extends FieldValues> {
  form: UseFormReturn<T>;

  submitting: boolean;

  submitLabel: string;
  cancelLabel: string;

  submitDisabled: boolean;

  onCancel?: () => void;
}

export function FormFooter<T extends FieldValues>({
  form,

  submitting,

  submitLabel,
  cancelLabel,

  submitDisabled,

  onCancel,
}: FormFooterProps<T>) {
  const hasChanges = form.formState.isDirty;

  return (
    <>
      <Separator />

      <div className="bg-background sticky bottom-0 flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="text-muted-foreground text-sm">
          {hasChanges ? (
            <span className="font-medium text-amber-600">You have unsaved changes.</span>
          ) : (
            <span>All changes are saved.</span>
          )}
        </div>

        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
              {cancelLabel}
            </Button>
          )}

          <Button type="submit" disabled={submitDisabled || submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {submitLabel}
          </Button>
        </div>
      </div>
    </>
  );
}
