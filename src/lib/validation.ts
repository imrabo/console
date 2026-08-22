
import * as zod from 'zod';

// ============================================================
// STRING VALIDATORS
// ============================================================

export const requiredString = (
  fieldName: string,
) =>
  zod
    .string()
    .trim()
    .min(1, `${ fieldName } is required`);


export const nameValidator = zod
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must not exceed 100 characters');


export const fullNameValidator = zod
  .string()
  .trim()
  .min(2, 'Full name must be at least 2 characters')
  .max(100, 'Full name must not exceed 100 characters');


export const descriptionValidator = zod
  .string()
  .trim()
  .min(5, 'Description must be at least 5 characters')
  .max(1000, 'Description must not exceed 1000 characters');


// ============================================================
// EMAIL
// ============================================================

export const emailValidator = zod
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email must not exceed 255 characters');


// ============================================================
// PASSWORD
// ============================================================

export const passwordValidator = zod
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(
    /[A-Z]/,
    'Password must contain at least one uppercase letter',
  )
  .regex(
    /[a-z]/,
    'Password must contain at least one lowercase letter',
  )
  .regex(
    /[0-9]/,
    'Password must contain at least one number',
  )
  .regex(
    /[^A-Za-z0-9]/,
    'Password must contain at least one special character',
  );


export const currentPasswordValidator = zod
  .string()
  .min(1, 'Current password is required');


export const confirmPasswordValidator = zod
  .string()
  .min(1, 'Please confirm your password');


// ============================================================
// MOBILE / PHONE
// ============================================================

export const mobileNoValidator = zod
  .string()
  .trim()
  .min(10, 'Mobile number must be at least 10 digits')
  .max(15, 'Mobile number must not exceed 15 digits')
  .regex(
    /^\+?[0-9]{10,15}$/,
    'Please enter a valid mobile number',
  );


// ============================================================
// OTP / VERIFICATION CODE
// ============================================================

export const otpValidator = zod
  .string()
  .trim()
  .length(6, 'OTP must be 6 digits')
  .regex(
    /^\d{6}$/,
    'OTP must contain only numbers',
  );


export const verificationCodeValidator = zod
  .string()
  .trim()
  .min(4, 'Verification code is required');


// ============================================================
// DATE / TIME
// ============================================================

export const dateValidator = zod
  .string()
  .min(1, 'Date is required');


export const optionalDateValidator = zod
  .string()
  .optional();


export const timeValidator = zod
  .string()
  .min(1, 'Time is required');


// ============================================================
// NUMBER
// ============================================================

export const positiveNumberValidator = zod
  .coerce
  .number()
  .positive('Value must be greater than zero');


export const nonNegativeNumberValidator = zod
  .coerce
  .number()
  .min(0, 'Value cannot be negative');


// ============================================================
// LOCATION
// ============================================================

export const latitudeValidator = zod
  .coerce
  .number()
  .min(-90, 'Latitude must be between -90 and 90')
  .max(90, 'Latitude must be between -90 and 90');


export const longitudeValidator = zod
  .coerce
  .number()
  .min(-180, 'Longitude must be between -180 and 180')
  .max(180, 'Longitude must be between -180 and 180');


// ============================================================
// BOOLEAN
// ============================================================

export const requiredBooleanValidator = (
  message = 'This field is required',
) =>
  zod
    .boolean()
    .refine(
      (value) => value === true,
      message,
    );


// ============================================================
// SEARCH
// ============================================================

export const searchValidator = zod
  .string()
  .trim()
  .max(100, 'Search must not exceed 100 characters')
  .optional();


// ============================================================
// LANGUAGE
// ============================================================

export const languageCodeValidator = zod
  .string()
  .trim()
  .min(2, 'Language is required')
  .max(10, 'Invalid language code');


// ============================================================
// TOKEN
// ============================================================

export const tokenValidator = zod
  .string()
  .min(1, 'Token is required');


export const optionalTokenValidator = zod
  .string()
  .min(1)
  .optional();


// ============================================================
// ID
// ============================================================

export const idValidator = zod
  .string()
  .trim()
  .min(1, 'ID is required');


// ============================================================
// COMMON OBJECT VALIDATORS
// ============================================================

export const passwordConfirmationValidator = (
  passwordField = 'password',
  confirmPasswordField = 'confirmPassword',
) =>
  zod
    .object({})
    .superRefine((data, ctx) => {
      const password = (
        data as Record<string, unknown>
      )[passwordField];

      const confirmPassword = (
        data as Record<string, unknown>
      )[confirmPasswordField];

      if (password !== confirmPassword) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          path: [confirmPasswordField],
          message: 'Passwords do not match',
        });
      }
    });

