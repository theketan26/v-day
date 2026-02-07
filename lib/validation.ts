import { z } from 'zod'

export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const appTitleSchema = z.string().min(1, 'Title is required').max(100, 'Title too long')

export const customizationSchema = z.record(z.unknown())

export const passkeySchema = z
  .string()
  .min(4, 'Passkey must be at least 4 characters')
  .max(20, 'Passkey must be less than 20 characters')
  .regex(/^[a-zA-Z0-9-]*$/, 'Passkey can only contain letters, numbers, and hyphens')
