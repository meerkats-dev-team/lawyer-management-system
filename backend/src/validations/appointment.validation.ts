import { z } from 'zod';
import { AppointmentStatus } from '../models/Appointment.schema';

// مخطط للتحقق من أن النص هو ObjectId صالح
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Object ID format');

// مخطط للتحقق من متغيرات المسار التي تحتوي على caseId فقط
export const caseParamsSchema = z.object({
  params: z.object({
    caseId: objectIdSchema,
  }),
});

// مخطط للتحقق من متغيرات المسار التي تحتوي على caseId و appointmentId
export const appointmentParamsSchema = z.object({
  params: z.object({
    caseId: objectIdSchema,
    appointmentId: objectIdSchema,
  }),
});

// مخطط لإنشاء موعد جديد (يتحقق من الـ body فقط)
export const createAppointmentSchema = z.object({
  body: z.object({
    time: z.string().nonempty( 'Time is required').datetime({ message: 'Invalid datetime format. Expected ISO 8601 format.' }),
    location: z.string().nonempty('Location is required' ).min(3),
    notes: z.string().optional(),
    status: z.nativeEnum(AppointmentStatus).optional(),
  }),
});

// مخطط لتحديث موعد (يتحقق من الـ body و الـ params معًا)
export const updateAppointmentSchema = z.object({
  body: z.object({
    time: z.string().datetime({ message: 'Invalid datetime format.' }).optional(),
    location: z.string().min(3).optional(),
    notes: z.string().optional(),
    status: z.nativeEnum(AppointmentStatus).optional(),
  }),
  params: z.object({
    caseId: objectIdSchema,
    appointmentId: objectIdSchema,
  }),
});