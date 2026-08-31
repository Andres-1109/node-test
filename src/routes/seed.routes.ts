import { Router } from 'express';
import { uploadSeed } from '../controllers/seed.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { upload } from '../middlewares/upload';

const router = Router();

router.post('/upload', authenticate, authorize('administrator'), upload.single('file'), uploadSeed);

export default router;
