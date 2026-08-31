import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors';
import { verifyToken } from '../utils/jwt';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new UnauthorizedError('Missing or malformed Authorization header'));
    return;
  }

  const token = authHeader.slice('Bearer '.length);
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}
