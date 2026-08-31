import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { ValidationError } from '../errors';

function jsonFileFilter(_req: Request, file: Express.Multer.File, callback: FileFilterCallback): void {
  const isJsonFile = file.mimetype === 'application/json' || file.originalname.toLowerCase().endsWith('.json');
  if (!isJsonFile) {
    callback(new ValidationError('Only .json files are allowed'));
    return;
  }
  callback(null, true);
}

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: jsonFileFilter,
});
