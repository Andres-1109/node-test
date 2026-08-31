import { Request, Response } from 'express';
import { SeedService } from '../services/seed.service';
import { catchAsync } from '../utils/catchAsync';
import { seedDataSchema } from '../dtos/seed.dto';
import { ValidationError } from '../errors';

const seedService = new SeedService();

export const uploadSeed = catchAsync(async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    throw new ValidationError('A JSON file is required in the "file" field');
  }

  let parsedContent: unknown;
  try {
    parsedContent = JSON.parse(req.file.buffer.toString('utf-8'));
  } catch {
    throw new ValidationError('The uploaded file is not valid JSON');
  }

  const result = seedDataSchema.safeParse(parsedContent);
  if (!result.success) {
    throw new ValidationError('The uploaded JSON does not match the expected seed structure', result.error.issues);
  }

  const summary = await seedService.seed(result.data);
  res.status(201).json(summary);
});
