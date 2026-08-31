import { Router } from 'express';
import { uploadSeed } from '../controllers/seed.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { upload } from '../middlewares/upload';

const router = Router();

/**
 * @swagger
 * /seed/upload:
 *   post:
 *     tags: [Seed]
 *     summary: Seed the database from a JSON file
 *     description: >
 *       Administrator only. Uploads a .json file (multipart/form-data, field name "file") with
 *       { users, clinics, warehouses, medications } arrays. Warehouses are referenced by a local
 *       `key` string in the JSON (not a real database id); medications reference that warehouse
 *       via `warehouseKey`. Insertion happens in dependency order (warehouses before medications)
 *       inside a single transaction, so a partial failure leaves nothing inserted.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: >
 *                   A .json file shaped like { "users": [...], "clinics": [...],
 *                   "warehouses": [{ "key": "central-warehouse", "name": "...", "location": "..." }],
 *                   "medications": [{ ..., "warehouseKey": "central-warehouse" }] }.
 *                   See src/seeders/seed-data.json for a full working example.
 *     responses:
 *       201:
 *         description: The number of records inserted per entity.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SeedSummaryResponse'
 *       400:
 *         description: Missing file, non-.json file, invalid JSON syntax, JSON not matching the expected structure, or a medication referencing an unknown warehouseKey.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { status: "error", message: "Medication \"Ibuprofen 400mg\" references warehouseKey \"unknown\", which is not present in the uploaded warehouses" }
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
 *         description: A user email, clinic taxId, or other unique field already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/upload', authenticate, authorize('administrator'), upload.single('file'), uploadSeed);

export default router;
