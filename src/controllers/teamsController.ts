import { Request, Response } from 'express';
import { smogonService } from '../services';
import { asyncHandler } from '../middleware/asyncHandler';

export const getTeams = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { format } = req.query;
  
  const teams = await smogonService.getTeams(format as string);
  res.json(teams);
});
