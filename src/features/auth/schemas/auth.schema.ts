import zod from "zod";

export const loginSchema = zod.object({
    email: zod.string().email('Enter a valid email'),
    password: zod.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = zod.infer<typeof loginSchema>;