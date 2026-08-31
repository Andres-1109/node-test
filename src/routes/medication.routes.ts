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

router.get('/', listMedications);
router.post('/', authorize('administrator'), validate(createMedicationSchema), createMedication);
router.put('/:id', authorize('administrator'), validate(updateMedicationSchema), updateMedication);
router.delete('/:id', authorize('administrator'), deleteMedication);

export default router;
