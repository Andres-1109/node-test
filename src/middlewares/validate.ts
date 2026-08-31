import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';
import { ValidationError } from '../errors';

export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(new ValidationError('Invalid request body', result.error.issues));
      return;
    }
    req.body = result.data;
    next();
  };
}
