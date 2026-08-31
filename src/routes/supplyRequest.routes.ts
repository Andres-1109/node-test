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

router.get('/active', listActiveSupplyRequests);
router.get('/clinic/:clinicId', getClinicSupplyRequestHistory);

router.post(
  '/',
  authorize('administrator', 'requestManager'),
  validate(createSupplyRequestSchema),
  createSupplyRequest
);

router.put(
  '/:id/status',
  authorize('administrator', 'requestManager'),
  validate(updateSupplyRequestStatusSchema),
  updateSupplyRequestStatus
);

router.put('/:id', authorize('administrator'), validate(updateSupplyRequestSchema), updateSupplyRequest);
router.delete('/:id', authorize('administrator'), deleteSupplyRequest);
router.get('/:id', getSupplyRequestById);

export default router;
