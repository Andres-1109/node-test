import { z } from 'zod';

export const createMedicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  warehouseId: z.number().int().positive('Warehouse ID must be a positive integer'),
  availableQuantity: z.number().int().min(0, 'Available quantity cannot be negative'),
});

export type CreateMedicationDto = z.infer<typeof createMedicationSchema>;

export const updateMedicationSchema = createMedicationSchema.partial();

export type UpdateMedicationDto = z.infer<typeof updateMedicationSchema>;

export interface MedicationResponseDto {
  id: number;
  name: string;
  description: string;
  warehouseId: number;
  availableQuantity: number;
  isActive: boolean;
}
