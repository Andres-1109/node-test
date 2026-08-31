import { Router } from 'express';
import { createClinic, deleteClinic, listClinics, updateClinic } from '../controllers/clinic.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createClinicSchema, updateClinicSchema } from '../dtos/clinic.dto';

const router = Router();

router.use(authenticate);

router.get('/', listClinics);
router.post('/', authorize('administrator'), validate(createClinicSchema), createClinic);
router.put('/:id', authorize('administrator'), validate(updateClinicSchema), updateClinic);
router.delete('/:id', authorize('administrator'), deleteClinic);

export default router;
