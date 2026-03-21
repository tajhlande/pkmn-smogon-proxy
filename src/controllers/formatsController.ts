import { Request, Response } from 'express';
import { smogonService } from '../services';
import { asyncHandler } from '../middleware/asyncHandler';

export const getFormats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const formats = await smogonService.getFormats();
  res.json(formats);
});
