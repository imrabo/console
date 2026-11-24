// const fullName= (minLength: number, maxLength: number) => z.string().min(minLength, 'Full name must be at least 2 characters').max(maxLength, 'Full name cannot exceed 100 characters');
import { z } from 'zod';

/**
 * Common reusable validators
 *
 * Module-specific schemas should compose these validators
 * instead of duplicating validation logic.
 */

// -------------------------
// String Validators
// -------------------------

export const requiredString = (message = 'This field is required') =>
  z.string().trim().min(1, message);

export const optionalString = z.preprocess((value) => {
  if (value === '') {
    return undefined;
  }

  return value;
}, z.string().trim().optional());

export const fullName = (minLength = 2, maxLength = 100) =>
  z
    .string()
    .trim()
    .min(minLength, `Full name must be at least ${minLength} characters`)
    .max(maxLength, `Full name cannot exceed ${maxLength} characters`);

// -------------------------
// Email
// -------------------------

export const email = z.string().trim().email('Please enter a valid email address');

// -------------------------
// Phone Number
// -------------------------

export const phoneNumber = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, 'Please enter a valid phone number');

// -------------------------
// ID Validators
// -------------------------

export const id = z.string().trim().min(1, 'ID is required');

export const userId = id;

export const adminId = id;

export const communityId = id;

// -------------------------
// Number Validators
// -------------------------

export const positiveNumber = z.number().positive('Value must be greater than 0');

export const nonNegativeNumber = z.number().min(0, 'Value cannot be negative');

export const nonNegativeInteger = z
  .number()
  .int('Value must be an integer')
  .min(0, 'Value cannot be negative');

// -------------------------
// Currency
// -------------------------

export const currency = z
  .string()
  .trim()
  .length(3, 'Currency must be a 3-letter ISO code')
  .regex(/^[A-Z]{3}$/, 'Currency must be a valid 3-letter ISO code');

// -------------------------
// URL
// -------------------------

export const url = z.string().trim().url('Please enter a valid URL');

export const optionalUrl = url.optional().or(z.literal(''));

// -------------------------
// Arrays
// -------------------------

export const stringArray = z.array(z.string());

export const idArray = z.array(id);

// -------------------------
// Dates
// -------------------------

export const date = z.date();

export const optionalDate = date.optional();

// -------------------------
// Boolean
// -------------------------

export const boolean = z.boolean();
