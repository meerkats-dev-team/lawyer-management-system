import { z } from 'zod';
import { CaseStatus } from '../models/Case.schema';

// Zod schema for MongoDB ObjectId
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Object ID');

export const createCaseSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).min(3, 'Title must be at least 3 characters'),
    description: z.string({ required_error: 'Description is required' }).min(10, 'Description must be at least 10 characters'),
    status: z.nativeEnum(CaseStatus).optional(), // nativeEnum للتحقق من قيم الـ enum
    clientId: objectIdSchema,
  }),
});

export const updateCaseSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    status: z.nativeEnum(CaseStatus).optional(),
    // لا نسمح بتغيير العميل المرتبط بالقضية من خلال هذا المسار
  }),
  params: z.object({
    id: objectIdSchema,
  }),
});

export const caseIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});