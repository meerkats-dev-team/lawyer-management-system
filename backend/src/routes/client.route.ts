import { Router } from 'express';
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from '../controllers/client.controller';
import { protect } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate.middleware';
import { createClientSchema, updateClientSchema, clientIdSchema } from '../validations/client.validation';

const router = Router();

// تطبيق middleware الحماية على جميع المسارات في هذا الملف
router.use(protect);

/**
 * @swagger
 * tags:
 *   - name: Clients
 *     description: Client management
 */

/**
 * @swagger
 * /api/v1/clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       '201':
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 */
router
  .route('/')
  .post(validate(createClientSchema), createClient)
  .get(getClients);

/**
 * @swagger
 * /api/v1/clients/{id}:
 *   get:
 *     summary: Get client by ID
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Client ID
 *     responses:
 *       '200':
 *         description: Client data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       '404':
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *
 *   patch:
 *     summary: Update client by ID
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       '200':
 *         description: Client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       '404':
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *
 *   delete:
 *     summary: Delete client by ID
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Client ID
 *     responses:
 *       '200':
 *         description: Client deleted successfully
 *       '404':
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 */
router
  .route('/:id')
  .get(validate(clientIdSchema), getClientById)
  .patch(validate(updateClientSchema), updateClient)
  .delete(validate(clientIdSchema), deleteClient);

export default router;