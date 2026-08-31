import { z } from 'zod';
import { USER_ROLES } from '../models/enums';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(USER_ROLES, {
    error: `Role must be one of: ${USER_ROLES.join(', ')}`,
  }),
});

export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof loginSchema>;

export interface AuthResponseDto {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}
