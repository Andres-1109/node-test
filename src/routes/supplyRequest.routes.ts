import { Router } from 'express';
import {
  createSupplyRequest,
  deleteSupplyRequest,
  getClinicSupplyRequestHistory,
  getSupplyRequestById,
  listActiveSupplyRequests,
  updateSupplyRequest,
  updateSupplyRequestStatus,
} from '../controllers/supplyRequest.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import {
  createSupplyRequestSchema,
  updateSupplyRequestSchema,
  updateSupplyRequestStatusSchema,
} from '../dtos/supplyRequest.dto';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /supply-requests/active:
 *   get:
 *     tags: [Supply Requests]
 *     summary: List active (non-deleted) supply requests
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: The list of non-deleted supply requests, most recent first.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SupplyRequest'
 *       401:
 *         description: Missing or invalid JWT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/active', listActiveSupplyRequests);

/**
 * @swagger
 * /supply-requests/clinic/{clinicId}:
 *   get:
 *     tags: [Supply Requests]
 *     summary: Full request history for a clinic
 *     description: Includes supply requests of any status, and soft-deleted ones (isDeleted is independent of status).
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: clinicId
 *         required: true
 *         schema: { type: integer }
 *         example: 9
 *     responses:
 *       200:
 *         description: The clinic's full supply request history, most recent first.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SupplyRequest'
 *       401:
 *         description: Missing or invalid JWT.
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
 */
router.get('/clinic/:clinicId', getClinicSupplyRequestHistory);

/**
 * @swagger
 * /supply-requests:
 *   post:
 *     tags: [Supply Requests]
 *     summary: Create a supply request
 *     description: >
 *       Administrator or requestManager. warehouseId is derived automatically from the requested
 *       medication; requestManagerId is taken from the authenticated user's JWT. Validates clinic
 *       existence, medication existence, and that requestedQuantity does not exceed the medication's
 *       availableQuantity.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSupplyRequestRequest'
 *     responses:
 *       201:
 *         description: The created supply request (status defaults to "pending").
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplyRequest'
 *       400:
 *         description: Invalid request body (e.g. requestedQuantity <= 0).
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
 *       404:
 *         description: The referenced clinic or medication does not exist or is inactive.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: requestedQuantity exceeds the medication's availableQuantity.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { status: "error", message: "Requested quantity (9999) exceeds available quantity (500) for medication \"Ibuprofen 400mg\"" }
 */
router.post(
  '/',
  authorize('administrator', 'requestManager'),
  validate(createSupplyRequestSchema),
  createSupplyRequest
);

/**
 * @swagger
 * /supply-requests/{id}/status:
 *   put:
 *     tags: [Supply Requests]
 *     summary: Update a supply request's status
 *     description: >
 *       Administrator or requestManager. Only these transitions are allowed: pending -> approved,
 *       pending -> rejected, approved -> completed. Any other transition is rejected.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSupplyRequestStatusRequest'
 *     responses:
 *       200:
 *         description: The supply request with its updated status.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplyRequest'
 *       400:
 *         description: status is not one of the allowed enum values.
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
 *       404:
 *         description: No non-deleted supply request exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: The requested status transition is not allowed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example: { status: "error", message: "Cannot transition supply request status from \"completed\" to \"pending\"" }
 */
router.put(
  '/:id/status',
  authorize('administrator', 'requestManager'),
  validate(updateSupplyRequestStatusSchema),
  updateSupplyRequestStatus
);

/**
 * @swagger
 * /supply-requests/{id}:
 *   put:
 *     tags: [Supply Requests]
 *     summary: Full edit of a supply request
 *     description: >
 *       Administrator only. Edits clinicId, medicationId and/or requestedQuantity, re-validating
 *       existence and inventory availability. Status is not editable here; use PUT /supply-requests/{id}/status.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSupplyRequestRequest'
 *     responses:
 *       200:
 *         description: The updated supply request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplyRequest'
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
 *         description: The supply request, clinic, or medication does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: The resulting requestedQuantity exceeds the medication's availableQuantity.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', authorize('administrator'), validate(updateSupplyRequestSchema), updateSupplyRequest);

/**
 * @swagger
 * /supply-requests/{id}:
 *   delete:
 *     tags: [Supply Requests]
 *     summary: Logically delete a supply request
 *     description: Administrator only. Sets isDeleted to true, independently of the workflow status.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         example: 3
 *     responses:
 *       204:
 *         description: The supply request was logically deleted.
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
 *         description: No non-deleted supply request exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authorize('administrator'), deleteSupplyRequest);

/**
 * @swagger
 * /supply-requests/{id}:
 *   get:
 *     tags: [Supply Requests]
 *     summary: Supply request detail
 *     description: Returns the supply request even if it was soft-deleted.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         example: 2
 *     responses:
 *       200:
 *         description: The supply request, with clinic/warehouse/medication/requestManager included.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplyRequest'
 *       401:
 *         description: Missing or invalid JWT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No supply request exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getSupplyRequestById);

export default router;
