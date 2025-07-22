import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string()
      .nonempty('Name is required')
      .min(3, 'Name must be at least 3 characters long'),
    email: z.string()
      .nonempty('Email is required')
      .email('Invalid email address'),
    password: z.string()
      .nonempty('Password is required')
      .min(6, 'Password must be at least 6 characters long'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().nonempty('Email is required'),
    password: z.string().nonempty('Password is required'),
  }),
});