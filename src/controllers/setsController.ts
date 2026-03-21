import { Request, Response } from 'express';
import { smogonService } from '../services';
import { asyncHandler } from '../middleware/asyncHandler';

export const getSets = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { format, pokemon } = req.query;
  
  const sets = await smogonService.getSets(
    format as string,
    pokemon as string
  );
  
  res.json(sets);
});
