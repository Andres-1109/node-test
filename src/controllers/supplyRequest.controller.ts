import { Request, Response } from 'express';
import { SupplyRequestService } from '../services/supplyRequest.service';
import { catchAsync } from '../utils/catchAsync';

const supplyRequestService = new SupplyRequestService();

export const listActiveSupplyRequests = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const supplyRequests = await supplyRequestService.listActive();
  res.status(200).json(supplyRequests);
});

export const getSupplyRequestById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const supplyRequest = await supplyRequestService.getById(Number(req.params.id));
  res.status(200).json(supplyRequest);
});

export const getClinicSupplyRequestHistory = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const supplyRequests = await supplyRequestService.getHistoryByClinic(Number(req.params.clinicId));
  res.status(200).json(supplyRequests);
});

export const createSupplyRequest = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const supplyRequest = await supplyRequestService.create(req.body, req.user!.id);
  res.status(201).json(supplyRequest);
});

export const updateSupplyRequest = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const supplyRequest = await supplyRequestService.fullUpdate(Number(req.params.id), req.body);
  res.status(200).json(supplyRequest);
});

export const updateSupplyRequestStatus = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const supplyRequest = await supplyRequestService.updateStatus(Number(req.params.id), req.body);
  res.status(200).json(supplyRequest);
});

export const deleteSupplyRequest = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await supplyRequestService.softDelete(Number(req.params.id));
  res.status(204).send();
});
