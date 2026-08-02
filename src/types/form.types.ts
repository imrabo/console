import { TypeParams } from "zod/v4/core"; { FieldValues, UseFormReturn } from "react-hook-form";
import type { TypeParams } from "zod/v4/core";

interface FormWrapperProps<T extends FieldValues> {
    form: UseFormReturn<T>;

    title: string;
    description?: string;

    children: React.ReactNode;

    loading?: boolean;
    submitting?: boolean;

    submitLabel?: string;
    cancelLabel?: string;

    onCancel?: () => void;

    showFooter?: boolean;
    showHeader?: boolean;
    showDebug?: boolean;

    successMessage?: string;
    errorMessage?: string;

    className?: string;
}