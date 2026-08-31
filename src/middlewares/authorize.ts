import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors';
import { UserRole } from '../models/enums';

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError());
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      next(new ForbiddenError());
      return;
    }
    next();
  };
}
