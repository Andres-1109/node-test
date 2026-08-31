import { z } from 'zod';

export const createClinicSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
  managerName: z.string().min(1, 'Manager name is required'),
});

export type CreateClinicDto = z.infer<typeof createClinicSchema>;

export const updateClinicSchema = createClinicSchema.partial();

export type UpdateClinicDto = z.infer<typeof updateClinicSchema>;

export interface ClinicResponseDto {
  id: number;
  name: string;
  taxId: string;
  managerName: string;
  isActive: boolean;
}
