
import type { FieldValues, UseFormReturn } from "react-hook-form";

export interface FormWrapperProps<T extends FieldValues> {
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