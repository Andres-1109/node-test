import { Router } from 'express';
import { createWarehouse, deleteWarehouse, listWarehouses, updateWarehouse } from '../controllers/warehouse.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createWarehouseSchema, updateWarehouseSchema } from '../dtos/warehouse.dto';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /warehouses:
 *   get:
 *     tags: [Warehouses]
 *     summary: List active warehouses
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: The list of active warehouses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Warehouse'
 *       401:
 *         description: Missing or invalid JWT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', listWarehouses);

/**
 * @swagger
 * /warehouses:
 *   post:
 *     tags: [Warehouses]
 *     summary: Create a warehouse
 *     description: Administrator only.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWarehouseRequest'
 *     responses:
 *       201:
 *         description: The created warehouse.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warehouse'
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
 */
router.post('/', authorize('administrator'), validate(createWarehouseSchema), createWarehouse);

/**
 * @swagger
 * /warehouses/{id}:
 *   put:
 *     tags: [Warehouses]
 *     summary: Update a warehouse
 *     description: Administrator only.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWarehouseRequest'
 *     responses:
 *       200:
 *         description: The updated warehouse.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warehouse'
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
 *         description: No warehouse exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', authorize('administrator'), validate(updateWarehouseSchema), updateWarehouse);

/**
 * @swagger
 * /warehouses/{id}:
 *   delete:
 *     tags: [Warehouses]
 *     summary: Logically delete a warehouse
 *     description: Administrator only. Sets isActive to false.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         example: 3
 *     responses:
 *       204:
 *         description: The warehouse was logically deleted.
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
 *         description: No active warehouse exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authorize('administrator'), deleteWarehouse);

export default router;
