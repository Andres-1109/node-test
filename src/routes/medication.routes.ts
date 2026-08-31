import { Router } from 'express';
import {
  createMedication,
  deleteMedication,
  listMedications,
  updateMedication,
} from '../controllers/medication.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createMedicationSchema, updateMedicationSchema } from '../dtos/medication.dto';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /medications:
 *   get:
 *     tags: [Medications]
 *     summary: List active medications
 *     description: Includes each medication's availableQuantity.
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: The list of active medications.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Medication'
 *       401:
 *         description: Missing or invalid JWT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', listMedications);

/**
 * @swagger
 * /medications:
 *   post:
 *     tags: [Medications]
 *     summary: Create a medication in a warehouse
 *     description: Administrator only. Validates that the referenced warehouse exists and is active.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMedicationRequest'
 *     responses:
 *       201:
 *         description: The created medication.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medication'
 *       400:
 *         description: Invalid request body (e.g. negative availableQuantity).
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
 *         description: The referenced warehouse does not exist or is inactive.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { status: "error", message: "Warehouse with ID 99 was not found" }
 */
router.post('/', authorize('administrator'), validate(createMedicationSchema), createMedication);

/**
 * @swagger
 * /medications/{id}:
 *   put:
 *     tags: [Medications]
 *     summary: Update a medication
 *     description: Administrator only. Can update availableQuantity.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         example: 4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMedicationRequest'
 *     responses:
 *       200:
 *         description: The updated medication.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medication'
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
 *         description: No medication exists with the given ID, or the new warehouseId is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', authorize('administrator'), validate(updateMedicationSchema), updateMedication);

/**
 * @swagger
 * /medications/{id}:
 *   delete:
 *     tags: [Medications]
 *     summary: Logically delete a medication
 *     description: Administrator only. Sets isActive to false.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         example: 4
 *     responses:
 *       204:
 *         description: The medication was logically deleted.
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
 *         description: No active medication exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authorize('administrator'), deleteMedication);

export default router;
