import { Request, Response } from 'express';
import { WarehouseService } from '../services/warehouse.service';
import { catchAsync } from '../utils/catchAsync';

const warehouseService = new WarehouseService();

export const listWarehouses = catchAsync(async (_req: Request, res: Response): Promise<void> => {
  const warehouses = await warehouseService.listActive();
  res.status(200).json(warehouses);
});

export const createWarehouse = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const warehouse = await warehouseService.create(req.body);
  res.status(201).json(warehouse);
});

export const updateWarehouse = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const warehouse = await warehouseService.update(Number(req.params.id), req.body);
  res.status(200).json(warehouse);
});

export const deleteWarehouse = catchAsync(async (req: Request, res: Response): Promise<void> => {
  await warehouseService.softDelete(Number(req.params.id));
  res.status(204).send();
});
