'use client';

import React from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils/utils';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { FormFooter } from './FormFooter';

/* ================================================================
   FORM WRAPPER
================================================================ */

export interface FormWrapperProps<
  TInput extends FieldValues,
  TContext = unknown,
  TOutput extends FieldValues = TInput,
> {
  /**
   * React Hook Form instance.
   *
   * Supports different input and output types when using
   * Zod resolvers with transformations/defaults.
   */
  form: UseFormReturn<TInput, TContext, TOutput>;

  /**
   * Form submit handler.
   *
   * Receives the validated resolver output.
   */
  onSubmit: (values: TOutput) => void | Promise<void>;

  /**
   * Optional form title.
   */
  title?: string;

  /**
   * Optional form description.
   */
  description?: string;

  /**
   * Form fields/content.
   */
  children: React.ReactNode;

  /**
   * Styling.
   */
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;

  /**
   * Loading states.
   */
  loading?: boolean;
  submitting?: boolean;

  /**
   * Layout controls.
   */
  showHeader?: boolean;
  showFooter?: boolean;

  /**
   * Footer labels.
   */
  submitLabel?: string;
  cancelLabel?: string;

  /**
   * Footer actions.
   */
  onCancel?: () => void;

  /**
   * Disable submit button.
   */
  submitDisabled?: boolean;

  /**
   * Loading overlay message.
   */
  loadingMessage?: string;

  /**
   * Development debugging.
   */
  showDevelopmentDebug?: boolean;

  /**
   * Development debug panel title.
   */
  developmentDebugTitle?: string;
}

export function FormWrapper<
  TInput extends FieldValues,
  TContext = unknown,
  TOutput extends FieldValues = TInput,
>({
  form,
  onSubmit,

  title,
  description,

  children,

  className,
  contentClassName,
  headerClassName,
  footerClassName,

  loading = false,
  submitting = false,

  showHeader = true,
  showFooter = true,

  submitLabel = 'Save',
  cancelLabel = 'Cancel',

  onCancel,

  submitDisabled = false,

  // loadingMessage = 'Please wait...',

  showDevelopmentDebug = true,

  developmentDebugTitle = 'React Hook Form Debug',
}: FormWrapperProps<TInput, TContext, TOutput>) {
  const isBusy = loading || submitting;

  const shouldShowHeader = showHeader && Boolean(title || description);

  const shouldShowFooter = showFooter && Boolean(form);

  const shouldShowDevelopmentDebug =
    import.meta.env.DEV && showDevelopmentDebug && Boolean(form);

  /**
   * React Hook Form handles:
   *
   * 1. Native form submit
   * 2. Validation
   * 3. Resolver execution
   * 4. Validated output
   * 5. onSubmit callback
   */
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className={cn('relative w-full min-w-0', className)} aria-busy={isBusy}>
      {/* ============================================================
          LOADING OVERLAY
      ============================================================ */}

      {/* {isBusy && <LoadingOverlay message={loadingMessage} />} */}

      {/* ============================================================
          FORM
      ============================================================ */}

      <form onSubmit={handleSubmit} noValidate className="w-full min-w-0">
        <Card className={cn('w-full min-w-0 p-0', contentClassName)}>
          {/* ============================================================
              HEADER
          ============================================================ */}

          {shouldShowHeader && (
            <CardHeader className={cn('border-b py-5', headerClassName)}>
              {title && <CardTitle className="text-2xl font-bold">{title}</CardTitle>}

              {description && <CardDescription className="text-lg">{description}</CardDescription>}
            </CardHeader>
          )}

          {/* ============================================================
              CONTENT
          ============================================================ */}

          <CardContent className="min-w-0">{children}</CardContent>

          {/* ============================================================
              FOOTER
          ============================================================ */}

          {shouldShowFooter && (
            <CardFooter className="w-full min-w-0">
              <div className={cn('w-full min-w-0 border-t pt-4', footerClassName)}>
                <FormFooter
                  submitting={submitting}
                  submitLabel={submitLabel}
                  cancelLabel={cancelLabel}
                  submitDisabled={submitDisabled || loading}
                  onCancel={onCancel}
                />
              </div>
            </CardFooter>
          )}
        </Card>
      </form>

      {/* ============================================================
          DEVELOPMENT DEBUG
      ============================================================ */}

      {shouldShowDevelopmentDebug && (
        <FormDevelopmentDebug form={form} title={developmentDebugTitle} />
      )}
    </div>
  );
}

/* ================================================================
   LOADING OVERLAY
================================================================ */

interface LoadingOverlayProps {
  message?: string;
}

function LoadingOverlay({ message = 'Please wait...' }: LoadingOverlayProps) {
  return (
    <div
      className="bg-background/70 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="bg-background flex items-center gap-3 rounded-lg border px-6 py-4 shadow-lg">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />

        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

/* ================================================================
   DEVELOPMENT DEBUG
================================================================ */

interface FormDevelopmentDebugProps<
  TInput extends FieldValues,
  TContext = unknown,
  TOutput extends FieldValues = TInput,
> {
  form: UseFormReturn<TInput, TContext, TOutput>;
  title: string;
}

function FormDevelopmentDebug<
  TInput extends FieldValues,
  TContext = unknown,
  TOutput extends FieldValues = TInput,
>({ form, title }: FormDevelopmentDebugProps<TInput, TContext, TOutput>) {
  const values = form.watch();

  const {
    errors,
    dirtyFields,
    touchedFields,

    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
    submitCount,
    isValidating,
    isLoading,
  } = form.formState;

  const errorMessages = extractFormErrors(errors);

  return (
    <Card className="mt-6 w-full max-w-full min-w-0 border-dashed border-orange-300 dark:border-orange-800">
      {/* ============================================================
          DEBUG HEADER
      ============================================================ */}

      <CardHeader className="min-w-0">
        <CardTitle className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
          <span className="min-w-0 break-words">{title}</span>

          <span className="shrink-0 rounded-md bg-orange-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-orange-700 uppercase dark:bg-orange-950 dark:text-orange-300">
            Development Only
          </span>
        </CardTitle>

        <CardDescription className="break-words">
          Internal React Hook Form state. This panel is automatically hidden in production builds.
        </CardDescription>
      </CardHeader>

      {/* ============================================================
          DEBUG CONTENT
      ============================================================ */}

      <CardContent className="min-w-0 space-y-6 text-xs">
        {/* ============================================================
            VALUES
        ============================================================ */}

        <DebugSection title="Values">
          <DebugPre value={values} />
        </DebugSection>

        {/* ============================================================
            ERRORS
        ============================================================ */}

        <DebugSection title="Errors">
          {Object.keys(errorMessages).length > 0 ? (
            <DebugPre value={errorMessages} error />
          ) : (
            <div className="rounded bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              No validation errors
            </div>
          )}
        </DebugSection>

        {/* ============================================================
            DIRTY FIELDS
        ============================================================ */}

        <DebugSection title="Dirty Fields">
          <DebugPre value={dirtyFields} />
        </DebugSection>

        {/* ============================================================
            TOUCHED FIELDS
        ============================================================ */}

        <DebugSection title="Touched Fields">
          <DebugPre value={touchedFields} />
        </DebugSection>

        {/* ============================================================
            FORM STATE
        ============================================================ */}

        <DebugSection title="Form State">
          <DebugPre
            value={{
              isDirty,
              isValid,
              isSubmitting,
              isSubmitted,
              isSubmitSuccessful,
              isValidating,
              isLoading,
              submitCount,
            }}
          />
        </DebugSection>

        {/* ============================================================
            SUMMARY
        ============================================================ */}

        <DebugSection title="Summary">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <DebugStatus label="Valid" value={isValid} />

            <DebugStatus label="Dirty" value={isDirty} />

            <DebugStatus label="Submitting" value={isSubmitting} />

            <DebugStatus label="Submitted" value={isSubmitted} />
          </div>
        </DebugSection>
      </CardContent>
    </Card>
  );
}

/* ================================================================
   DEBUG SECTION
================================================================ */

interface DebugSectionProps {
  title: string;
  children: React.ReactNode;
}

function DebugSection({ title, children }: DebugSectionProps) {
  return (
    <div className="min-w-0">
      <h3 className="mb-2 font-semibold">{title}</h3>

      {children}
    </div>
  );
}

/* ================================================================
   DEBUG PRE
================================================================ */

interface DebugPreProps {
  value: unknown;
  error?: boolean;
}

function DebugPre({ value, error = false }: DebugPreProps) {
  return (
    <pre
      className={cn(
        [
          'box-border',
          'w-full',
          'min-w-0',
          'max-w-full',
          'max-h-[400px]',
          'overflow-auto',
          'rounded',
          'p-4',
          'whitespace-pre-wrap',
          'break-words',
          'text-xs',
          'leading-relaxed',
        ],
        error
          ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
          : 'bg-muted text-foreground'
      )}
    >
      {safeJsonStringify(value)}
    </pre>
  );
}

/* ================================================================
   DEBUG STATUS
================================================================ */

interface DebugStatusProps {
  label: string;
  value: boolean;
}

function DebugStatus({ label, value }: DebugStatusProps) {
  return (
    <div className="bg-muted min-w-0 rounded-lg border p-3">
      <p className="text-muted-foreground mb-1 text-[10px] font-medium uppercase">{label}</p>

      <p
        className={cn(
          'font-semibold',
          value ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
        )}
      >
        {value ? 'true' : 'false'}
      </p>
    </div>
  );
}

/* ================================================================
   ERROR EXTRACTION
================================================================ */

function extractFormErrors(errors: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  const walk = (value: unknown, path: string) => {
    if (!value || typeof value !== 'object') {
      return;
    }

    const objectValue = value as Record<string, unknown>;

    if ('message' in objectValue && objectValue.message !== undefined) {
      result[path] = objectValue.message;
      return;
    }

    Object.entries(objectValue).forEach(([key, childValue]) => {
      const nextPath = path ? `${path}.${key}` : key;

      walk(childValue, nextPath);
    });
  };

  Object.entries(errors).forEach(([key, value]) => {
    walk(value, key);
  });

  return result;
}

/* ================================================================
   SAFE JSON STRINGIFY
================================================================ */

function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(
      value,
      (_key, currentValue) => {
        if (currentValue instanceof Date) {
          return currentValue.toISOString();
        }

        if (typeof currentValue === 'function') {
          return '[Function]';
        }

        if (typeof currentValue === 'bigint') {
          return currentValue.toString();
        }

        return currentValue;
      },
      2
    );
  } catch {
    return '[Unable to serialize debug value]';
  }
}

export default FormWrapper;
