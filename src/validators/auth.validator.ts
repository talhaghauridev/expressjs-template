import { ApiMessages } from '@/constants/api-messages';
import { createSchema } from '@/utils/zod-schema-helper';
import { z } from 'zod';

export const registerSchema = createSchema({
  body: {
    name: z
      .string({ error: ApiMessages.VALIDATION.REQUIRED('Name') })
      .min(2, { error: ApiMessages.VALIDATION.MIN_LENGTH('Name', 2), abort: true })
      .max(100, { error: ApiMessages.VALIDATION.MAX_LENGTH('Name', 100), abort: true }),
    email: z.email({ error: ApiMessages.VALIDATION.INVALID_EMAIL, abort: true }),
    password: z
      .string({ error: ApiMessages.VALIDATION.REQUIRED('Password') })
      .min(8, { error: ApiMessages.VALIDATION.MIN_LENGTH('Password', 8), abort: true })
      .max(100, { error: ApiMessages.VALIDATION.MAX_LENGTH('Password', 100), abort: true }),
  },
});

export const loginSchema = createSchema({
  body: {
    email: z.email({ error: ApiMessages.VALIDATION.INVALID_EMAIL }),
    password: z
      .string({ error: ApiMessages.VALIDATION.REQUIRED('Password') })
      .min(8, { error: ApiMessages.VALIDATION.MIN_LENGTH('Password', 8), abort: true })
      .max(100, { error: ApiMessages.VALIDATION.MAX_LENGTH('Password', 100), abort: true }),
  },
});

export const verifyEmailSchema = createSchema({
  query: {
    token: z
      .string({ error: ApiMessages.VALIDATION.MUST_BE_STRING('Token') })
      .min(1, { error: ApiMessages.VALIDATION.REQUIRED('Token') }),
  },
});

export const verifyEmailOTPSchema = createSchema({
  body: {
    email: z.email({ error: ApiMessages.VALIDATION.INVALID_EMAIL }),
    otp: z
      .string({ error: ApiMessages.VALIDATION.REQUIRED('OTP') })
      .length(6, { error: 'OTP must be 6 characters' })
      .regex(/^\d+$/, { error: 'OTP must contain only digits' }),
  },
});
