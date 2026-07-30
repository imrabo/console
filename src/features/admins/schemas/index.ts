import * as z from 'zod';

// Admin user schema matching Firestore requirements
export const adminUserSchema = z.object({
  id: z.string().describe('Firestore document id'),
  email: z.string().email("Valid Email").describe('Admin login email'),
  fullName: z.string().min(1, 'Full name must be at least 1 character').describe('Required field'),
  password: z.string().min(8, 'Password must be at least 8 characters').describe('Required field'),
  createdAt: z.instanceof(Date).describe('Timestamp of creation'),
  isActive: z.boolean().default(true)
});

// Form validation schema for admin registration/login
export const adminUserFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
}).describe('Admin registration/login form')

// Type inference for admin user
export type AdminUser = z.infer<typeof adminUserSchema>;
export type AdminUserFormData = z.infer<typeof adminUserFormSchema>;