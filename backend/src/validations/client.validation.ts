import { z } from 'zod';

const contactInfoSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(11, 'Phone number seems too short').optional(),
  address: z.string().optional(),
}).optional();

export const createClientSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Client name is required' }).min(2, 'Client name must be at least 2 characters'),
    contactInfo: contactInfoSchema,
  }),
});

export const updateClientSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Client name must be at least 2 characters').optional(),
    contactInfo: contactInfoSchema,
  }),
  params: z.object({
      id: z.string({ required_error: 'Client ID is required in URL params' }),
  }),
});

export const clientIdSchema = z.object({
    params: z.object({
        id: z.string({ required_error: 'Client ID is required in URL params' }),
    }),
});