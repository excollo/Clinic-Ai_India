/**
 * Authentication validation schemas
 */

import { z } from 'zod';

// Password regex: at least 8 characters, one uppercase, one lowercase, one number
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

export const signupSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required' }),
  mobile: z
    .string()
    .min(10, { message: 'Valid mobile number is required' })
    .regex(/^[0-9+\-\s()]{10,15}$/, { message: 'Enter a valid mobile number' }),
  email: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: 'Invalid email address',
    }),
  medicalRegistrationNumber: z.string().min(3, { message: 'Medical registration number is required' }),
  specialty: z.string().min(1, { message: 'Please select your specialty' }),
  password: z.string().regex(passwordRegex, {
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  }),
  // Backend/consent is handled automatically. The UI checkbox is optional.
  agreement: z.boolean().optional().default(true),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

export const practiceSettingsSchema = z.object({
  practiceName: z.string().min(1, { message: 'Practice name is required' }),
  practiceEmail: z.string().email({ message: 'Invalid email address' }),
  timezone: z.string().min(1, { message: 'Timezone is required' }),
  logo: z.any().optional(),
  phone: z.string().optional(),
  cancellationPolicy: z.string().optional(),
});

export type PracticeSettingsFormValues = z.infer<typeof practiceSettingsSchema>;
