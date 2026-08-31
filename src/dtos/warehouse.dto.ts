import { z } from 'zod';

export const createWarehouseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
});

export type CreateWarehouseDto = z.infer<typeof createWarehouseSchema>;

export const updateWarehouseSchema = createWarehouseSchema.partial();

export type UpdateWarehouseDto = z.infer<typeof updateWarehouseSchema>;

export interface WarehouseResponseDto {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
}
