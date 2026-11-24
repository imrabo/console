/* ================================================================
   FORM FIELD
================================================================ */

import { FormFieldProps } from './form-field-props';

export function FormField({ label, htmlFor, error, required = false, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}

        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="mt-2">{children}</div>

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
