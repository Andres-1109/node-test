import { AppError } from './AppError';

export class ForbiddenError extends AppError {
  constructor(message: string = 'You do not have permission to perform this action') {
    super(message, 403);
  }
}
