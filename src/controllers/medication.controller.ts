import { Request, Response } from 'express';
import { MedicationService } from '../services/medication.service';
import { catchAsync } from '../utils/catchAsync';

const medicationService = new MedicationService();

export const listMedications = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const medications = await medicationService.listActive();
  res.status(200).json(medications);
});

export const createMedication = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const medication = await medicationService.create(req.body);
  res.status(201).json(medication);
});

export const updateMedication = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const medication = await medicationService.update(Number(req.params.id), req.body);
  res.status(200).json(medication);
});

export const deleteMedication = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await medicationService.softDelete(Number(req.params.id));
  res.status(204).send();
});
