import { Request, Response } from 'express';
import { smogonService } from '../services';
import { asyncHandler } from '../middleware/asyncHandler';

export const getAnalyses = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { format, pokemon } = req.query;
  
  const analyses = await smogonService.getAnalyses(
    format as string,
    pokemon as string
  );
  
  res.json(analyses);
});
