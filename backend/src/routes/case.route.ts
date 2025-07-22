import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { checkCaseOwnership } from '../middlewares/ownership.middleware';
import validate from '../middlewares/validate.middleware';

import { createCase, getCases, getCaseById, updateCase, deleteCase } from '../controllers/case.controller';
import { createCaseSchema, updateCaseSchema, caseIdSchema } from '../validations/case.validation';

import appointmentRouter from './appointment.route';
import fileRouter from './file.route'

const router = Router();

// تطبيق الحماية على جميع مسارات القضايا وما يتفرع منها
router.use(protect);

/**
 * @swagger
 * tags:
 *   - name: Cases
 *     description: Case management
 */

/**
 * @swagger
 * /api/v1/cases:
 *   post:
 *     summary: Create a new case
 *     tags: [Cases]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Case'
 *     responses:
 *       '201':
 *         description: Case created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Case'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *
 *   get:
 *     summary: Get all cases
 *     tags: [Cases]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of cases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Case'
 */
router.route('/')
  .post(validate(createCaseSchema), createCase)
  .get(getCases);

/**
 * @swagger
 * /api/v1/cases/{id}:
 *   get:
 *     summary: Get case by ID
 *     tags: [Cases]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Case ID
 *     responses:
 *       '200':
 *         description: Case data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Case'
 *       '404':
 *         description: Case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *
 *   patch:
 *     summary: Update case by ID
 *     tags: [Cases]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Case ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Case'
 *     responses:
 *       '200':
 *         description: Case updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Case'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       '404':
 *         description: Case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *
 *   delete:
 *     summary: Delete case by ID
 *     tags: [Cases]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Case ID
 *     responses:
 *       '200':
 *         description: Case deleted successfully
 *       '404':
 *         description: Case not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 */
router.route('/:id')
  .get(validate(caseIdSchema), getCaseById)
  .patch(validate(updateCaseSchema), updateCase)
  .delete(validate(caseIdSchema), deleteCase);

/**
 * @swagger
 * /api/v1/cases/{caseId}/appointments:
 *   get:
 *     summary: Get all appointments for a case
 *     tags: [Cases]
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
 *       '404':
 *         description: Case not found
 *
 *   post:
 *     summary: Create an appointment for a case
 *     tags: [Cases]
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
 *       '400':
 *         description: Validation error
 */
router.use('/:caseId/appointments', checkCaseOwnership, appointmentRouter);

/**
 * @swagger
 * /api/v1/cases/{caseId}/files:
 *   get:
 *     summary: Get all files for a case
 *     tags: [Cases]
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
 *         description: List of files for the case
 *       '404':
 *         description: Case not found
 *
 *   post:
 *     summary: Upload a file for a case
 *     tags: [Cases]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: File uploaded successfully
 *       '400':
 *         description: Validation error
 */
router.use('/:caseId/files', checkCaseOwnership, fileRouter);

export default router;