import { Request, Response } from 'express';
import { smogonService } from '../services';
import { asyncHandler } from '../middleware/asyncHandler';

export const getStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { format, pokemon, month, rating } = req.query;
  
  const stats = await smogonService.getStats(
    format as string,
    pokemon as string,
    month as string,
    rating ? parseInt(rating as string, 10) : undefined
  );
  
  res.json(stats);
});
