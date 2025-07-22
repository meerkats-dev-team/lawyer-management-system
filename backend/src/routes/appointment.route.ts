import { Router } from 'express';
import validate from '../middlewares/validate.middleware';
import {
  createAppointment,
  getAppointmentsForCase,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointment.controller';
import {
  caseParamsSchema,
  appointmentParamsSchema,
  createAppointmentSchema,
  updateAppointmentSchema
} from '../validations/appointment.validation';

// { mergeParams: true } يسمح لهذا الراوتر الفرعي بالوصول إلى متغيرات الراوتر الأب (مثل :caseId).
const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   - name: Appointments
 *     description: Appointment management
 */

/**
 * @swagger
 * /api/v1/cases/{caseId}/appointments:
 *   post:
 *     summary: Create a new appointment for a case
 *     tags: [Appointments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseId
 *         schema:
 *           type: string
 *         required: true
 *         description: Case ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       '201':
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       '400':
 *         description: Validation error
 *   get:
 *     summary: Get all appointments for a case
 *     tags: [Appointments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseId
 *         schema:
 *           type: string
 *         required: true
 *         description: Case ID
 *     responses:
 *       '200':
 *         description: List of appointments for the case
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       '404':
 *         description: Case not found
 */
router.route('/')
  .post(validate(createAppointmentSchema), createAppointment)
  .get(validate(caseParamsSchema), getAppointmentsForCase);

/**
 * @swagger
 * /api/v1/cases/{caseId}/appointments/{appointmentId}:
 *   get:
 *     summary: Get appointment by ID for a case
 *     tags: [Appointments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseId
 *         schema:
 *           type: string
 *         required: true
 *         description: Case ID
 *       - in: path
 *         name: appointmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Appointment ID
 *     responses:
 *       '200':
 *         description: Appointment data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       '404':
 *         description: Appointment not found
 *   patch:
 *     summary: Update appointment by ID for a case
 *     tags: [Appointments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseId
 *         schema:
 *           type: string
 *         required: true
 *         description: Case ID
 *       - in: path
 *         name: appointmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       '200':
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       '400':
 *         description: Validation error
 *       '404':
 *         description: Appointment not found
 *   delete:
 *     summary: Delete appointment by ID for a case
 *     tags: [Appointments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: caseId
 *         schema:
 *           type: string
 *         required: true
 *         description: Case ID
 *       - in: path
 *         name: appointmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Appointment ID
 *     responses:
 *       '200':
 *         description: Appointment deleted successfully
 *       '404':
 *         description: Appointment not found
 */
router.route('/:appointmentId')
  .get(validate(appointmentParamsSchema), getAppointmentById)
  .patch(validate(updateAppointmentSchema), updateAppointment)
  .delete(validate(appointmentParamsSchema), deleteAppointment);

export default router;