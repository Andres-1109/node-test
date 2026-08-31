import { z } from 'zod';
import { USER_ROLES } from '../models/enums';

const seedUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(USER_ROLES),
});

const seedClinicSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
  managerName: z.string().min(1, 'Manager name is required'),
});

// `key` has no meaning outside this JSON file: it only lets medications reference a
// warehouse by name before the warehouse has a real, database-generated id.
const seedWarehouseSchema = z.object({
  key: z.string().min(1, 'Warehouse key is required'),
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
});

const seedMedicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  warehouseKey: z.string().min(1, 'warehouseKey is required'),
  availableQuantity: z.number().int().min(0, 'Available quantity cannot be negative'),
});

export const seedDataSchema = z.object({
  users: z.array(seedUserSchema),
  clinics: z.array(seedClinicSchema),
  warehouses: z.array(seedWarehouseSchema),
  medications: z.array(seedMedicationSchema),
});

export type SeedDataDto = z.infer<typeof seedDataSchema>;

export interface SeedSummaryDto {
  users: number;
  clinics: number;
  warehouses: number;
  medications: number;
}
