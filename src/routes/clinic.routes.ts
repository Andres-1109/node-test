import { Router } from 'express';
import { createClinic, deleteClinic, listClinics, updateClinic } from '../controllers/clinic.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createClinicSchema, updateClinicSchema } from '../dtos/clinic.dto';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /clinics:
 *   get:
 *     tags: [Clinics]
 *     summary: List active clinics
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: The list of active clinics.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clinic'
 *       401:
 *         description: Missing or invalid JWT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', listClinics);

/**
 * @swagger
 * /clinics:
 *   post:
 *     tags: [Clinics]
 *     summary: Create a clinic
 *     description: Administrator only. Validates that taxId is unique.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClinicRequest'
 *     responses:
 *       201:
 *         description: The created clinic.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       400:
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Missing or invalid JWT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Authenticated user is not an administrator.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: A clinic with the same taxId already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { status: "error", message: "A clinic with taxId \"TAX-900111222\" already exists" }
 */
router.post('/', authorize('administrator'), validate(createClinicSchema), createClinic);

/**
 * @swagger
 * /clinics/{id}:
 *   put:
 *     tags: [Clinics]
 *     summary: Update a clinic
 *     description: Administrator only.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         example: 9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateClinicRequest'
 *     responses:
 *       200:
 *         description: The updated clinic.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       400:
 *         description: Invalid request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Missing or invalid JWT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Authenticated user is not an administrator.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No clinic exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: The new taxId is already used by another clinic.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', authorize('administrator'), validate(updateClinicSchema), updateClinic);

/**
 * @swagger
 * /clinics/{id}:
 *   delete:
 *     tags: [Clinics]
 *     summary: Logically delete a clinic
 *     description: Administrator only. Sets isActive to false.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         example: 9
 *     responses:
 *       204:
 *         description: The clinic was logically deleted.
 *       401:
 *         description: Missing or invalid JWT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Authenticated user is not an administrator.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No active clinic exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authorize('administrator'), deleteClinic);

export default router;
