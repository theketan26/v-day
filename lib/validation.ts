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

export const fullNameSchema = z
  .string()
  .min(1, 'Full name is required')
  .max(255, 'Full name must be less than 255 characters')
  .optional()

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  full_name: fullNameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// App-related schemas
export const appTitleSchema = z.string().min(1, 'Title is required').max(255, 'Title too long')

export const appSlugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(255, 'Slug too long')
  .regex(/^[a-zA-Z0-9-]*$/, 'Slug can only contain letters, numbers, and hyphens')

export const customizationSchema = z.record(z.string(), z.unknown())

export const passkeySchema = z
  .string()
  .min(4, 'Passkey must be at least 4 characters')
  .max(255, 'Passkey must be less than 255 characters')
  .regex(/^[a-zA-Z0-9-]*$/, 'Passkey can only contain letters, numbers, and hyphens')

// Template-related schemas
export const templateNameSchema = z.string().min(1, 'Name is required').max(255, 'Name too long')

export const templateDescriptionSchema = z.string().max(1000, 'Description too long').optional()

export const templateThemeSchema = z.string().min(1, 'Theme is required').max(50, 'Theme too long')

export const templateScreensSchema = z.array(z.unknown())

export const templateColorsSchema = z.record(z.string(), z.string()).optional()

export const templateAnimationsSchema = z.record(z.string(), z.unknown()).optional()

// Response-related schemas
export const visitorIdSchema = z.string().max(255, 'Visitor ID too long').optional()

export const screenIndexSchema = z.number().int().min(0).optional()

export const responseDataSchema = z.record(z.string(), z.unknown()).optional()

// Combined schemas for API requests
export const createAppSchema = z.object({
  template_id: z.string().uuid('Invalid template ID'),
  title: appTitleSchema,
  customizations: customizationSchema.optional().default({}),
})

export const updateAppSchema = z.object({
  title: appTitleSchema.optional(),
  customizations: customizationSchema.optional(),
  is_published: z.boolean().optional(),
  passkey: z.string().optional(),
})

export const publishAppSchema = z.object({
  is_published: z.boolean(),
})

export const appResponseSchema = z.object({
  visitor_id: visitorIdSchema,
  screen_index: screenIndexSchema,
  response_data: responseDataSchema,
})
