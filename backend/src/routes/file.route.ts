import { Router } from 'express';
import { uploadFile, getFilesForCase, deleteFile } from '../controllers/file.controller';
import upload from '../middlewares/upload.middleware';

const router = Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   - name: Files
 *     description: File management for cases
 */

/**
 * @swagger
 * /api/v1/cases/{caseId}/files:
 *   post:
 *     summary: Upload a file for a case
 *     tags: [Files]
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/File'
 *       '400':
 *         description: Validation error
 *   get:
 *     summary: Get all files for a case
 *     tags: [Files]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/File'
 *       '404':
 *         description: Case not found
 */
router.route('/')
  .post(upload.single('file'), uploadFile)
  .get(getFilesForCase);

/**
 * @swagger
 * /api/v1/cases/{caseId}/files/{fileId}:
 *   delete:
 *     summary: Delete a file by ID for a case
 *     tags: [Files]
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
 *         name: fileId
 *         schema:
 *           type: string
 *         required: true
 *         description: File ID
 *     responses:
 *       '200':
 *         description: File deleted successfully
 *       '404':
 *         description: File not found
 */
router.route('/:fileId')
  .delete(deleteFile);

export default router;