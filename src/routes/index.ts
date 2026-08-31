import { Router } from 'express';
import authRoutes from './auth.routes';
import clinicRoutes from './clinic.routes';
import warehouseRoutes from './warehouse.routes';
import medicationRoutes from './medication.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/clinics', clinicRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/medications', medicationRoutes);

export default router;
