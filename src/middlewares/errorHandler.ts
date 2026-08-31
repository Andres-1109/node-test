import { NextFunction, Request, Response } from 'express';
import { ValidationError as SequelizeValidationError, UniqueConstraintError } from 'sequelize';
import { AppError, ConflictError, ValidationError } from '../errors';

interface ErrorResponseBody {
  status: 'error';
  message: string;
  details?: unknown;
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    const body: ErrorResponseBody = { status: 'error', message: err.message };
    if (err instanceof ValidationError && err.details !== undefined) {
      body.details = err.details;
    }
    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof UniqueConstraintError) {
    const conflict = new ConflictError('A record with the same unique field already exists');
    res.status(conflict.statusCode).json({ status: 'error', message: conflict.message });
    return;
  }

  if (err instanceof SequelizeValidationError) {
    res.status(400).json({ status: 'error', message: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ status: 'error', message: 'Internal server error' });
}
