import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { loginSchema, registerSchema } from '../dtos/auth.dto';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Public endpoint. The caller picks their own role (administrator or requestManager). No JWT required.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           examples:
 *             administrator:
 *               summary: Register an administrator
 *               value: { name: "Laura Gomez", email: "laura.admin@riwimedicare.com", password: "Secret123", role: "administrator" }
 *             requestManager:
 *               summary: Register a request manager
 *               value: { name: "Diana Torres", email: "diana.manager@riwimedicare.com", password: "Secret123", role: "requestManager" }
 *     responses:
 *       201:
 *         description: User registered successfully; returns a JWT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid request body (missing field, invalid email, password too short, invalid role).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { status: "error", message: "Invalid request body", details: [{ path: ["email"], message: "Invalid email format" }] }
 *       409:
 *         description: A user with the same email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { status: "error", message: "A user with email \"laura.admin@riwimedicare.com\" already exists" }
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate a user
 *     description: Public endpoint. Validates credentials and returns a JWT with { id, role } in the payload.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example: { email: "laura.admin@riwimedicare.com", password: "Secret123" }
 *     responses:
 *       200:
 *         description: Login successful; returns a JWT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid request body (missing email/password, invalid email format).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { status: "error", message: "Invalid email or password" }
 */
router.post('/login', validate(loginSchema), login);

export default router;
