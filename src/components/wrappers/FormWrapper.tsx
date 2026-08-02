import React from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

import { FormFooter } from "./FormFooter";

export interface FormWrapperProps<T extends FieldValues> {
  form: UseFormReturn<T>;

  title: string;
  description?: string;

  children: React.ReactNode;

  className?: string;

  loading?: boolean;
  submitting?: boolean;

  showHeader?: boolean;
  showFooter?: boolean;

  submitLabel?: string;
  cancelLabel?: string;

  onCancel?: () => void;

  submitDisabled?: boolean;
}

export function FormWrapper<T extends FieldValues>({
  form,

  title,
  description,

  children,

  className,

  loading = false,
  submitting = false,

  showHeader = true,
  showFooter = true,

  submitLabel = "Save",
  cancelLabel = "Cancel",

  onCancel,

  submitDisabled = false,
}: FormWrapperProps<T>) {
  const isBusy = loading || submitting;

  return (
    <div className={cn("relative", className)}>
      {isBusy && <LoadingOverlay />}

      <Card className="overflow-hidden">
        {showHeader && (
          <CardHeader className="border-b">
            <CardTitle>{title}</CardTitle>

            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}

        <CardContent className="space-y-6 p-6">{children}</CardContent>

        {showFooter && (
          <FormFooter
            form={form}
            submitting={submitting}
            submitLabel={submitLabel}
            cancelLabel={cancelLabel}
            submitDisabled={submitDisabled}
            onCancel={onCancel}
          />
        )}
      </Card>
    </div>
  );
}
function LoadingOverlay() {
  return (
    <div className="bg-background/70 absolute inset-0 z-50 flex items-center justify-center rounded-lg backdrop-blur-sm">
      <div className="bg-background flex items-center gap-3 rounded-lg border px-6 py-4 shadow-lg">
        <Loader2 className="h-5 w-5 animate-spin" />

        <span className="text-sm font-medium">Please wait...</span>
      </div>
    </div>
  );
}
