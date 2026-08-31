import { Request, Response } from 'express';
import { ClinicService } from '../services/clinic.service';
import { catchAsync } from '../utils/catchAsync';

const clinicService = new ClinicService();

export const listClinics = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const clinics = await clinicService.listActive();
  res.status(200).json(clinics);
});

export const createClinic = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const clinic = await clinicService.create(req.body);
  res.status(201).json(clinic);
});

export const updateClinic = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const clinic = await clinicService.update(Number(req.params.id), req.body);
  res.status(200).json(clinic);
});

export const deleteClinic = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await clinicService.softDelete(Number(req.params.id));
  res.status(204).send();
});
