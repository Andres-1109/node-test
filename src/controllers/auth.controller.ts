import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';

const authService = new AuthService();

export const register = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.login(req.body);
  res.status(200).json(result);
});
