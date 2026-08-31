import { z } from 'zod';
import { SUPPLY_REQUEST_STATUSES, SupplyRequestStatus } from '../models/enums';

export const createSupplyRequestSchema = z.object({
  clinicId: z.number().int().positive('clinicId must be a positive integer'),
  medicationId: z.number().int().positive('medicationId must be a positive integer'),
  requestedQuantity: z.number().int().positive('requestedQuantity must be greater than zero'),
});

export type CreateSupplyRequestDto = z.infer<typeof createSupplyRequestSchema>;

export const updateSupplyRequestSchema = z.object({
  clinicId: z.number().int().positive('clinicId must be a positive integer').optional(),
  medicationId: z.number().int().positive('medicationId must be a positive integer').optional(),
  requestedQuantity: z.number().int().positive('requestedQuantity must be greater than zero').optional(),
});

export type UpdateSupplyRequestDto = z.infer<typeof updateSupplyRequestSchema>;

export const updateSupplyRequestStatusSchema = z.object({
  status: z.enum(SUPPLY_REQUEST_STATUSES, {
    error: `status must be one of: ${SUPPLY_REQUEST_STATUSES.join(', ')}`,
  }),
});

export type UpdateSupplyRequestStatusDto = z.infer<typeof updateSupplyRequestStatusSchema>;

export interface SupplyRequestResponseDto {
  id: number;
  clinicId: number;
  medicationId: number;
  warehouseId: number;
  requestManagerId: number;
  requestedQuantity: number;
  status: SupplyRequestStatus;
  isDeleted: boolean;
}
