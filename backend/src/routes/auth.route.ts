import { Router } from 'express';
import { register, login, googleLogin, googleCallback } from '../controllers/auth.controller';
import validate from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validations/auth.validation';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User registration and login
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Meerkats'
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'jane.doe@example.com'
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 'password123'
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       '409':
 *         description: User with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'jane.doe@example.com'
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 'password123'
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '401':
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Redirect to Google OAuth login
 *     tags: [Authentication]
 *     responses:
 *       '302':
 *         description: Redirects to Google for authentication
 */
router.get('/google', googleLogin);

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: Google authentication successful
 *       '401':
 *         description: Google authentication failed
 */
router.get('/google/callback', googleCallback);

// يمكنك إضافة Facebook بنفس الطريقة
// router.get('/facebook', ...);
// router.get('/facebook/callback', ...);

export default router;