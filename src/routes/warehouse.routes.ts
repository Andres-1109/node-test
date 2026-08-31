import { Router } from 'express';
import {
  createWarehouse,
  deleteWarehouse,
  listWarehouses,
  updateWarehouse,
} from '../controllers/warehouse.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createWarehouseSchema, updateWarehouseSchema } from '../dtos/warehouse.dto';

const router = Router();

router.use(authenticate);

router.get('/', listWarehouses);
router.post('/', authorize('administrator'), validate(createWarehouseSchema), createWarehouse);
router.put('/:id', authorize('administrator'), validate(updateWarehouseSchema), updateWarehouse);
router.delete('/:id', authorize('administrator'), deleteWarehouse);

export default router;
