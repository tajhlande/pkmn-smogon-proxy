import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors';

export interface FormatQuery {
  format?: string;
}

export interface SetsQuery {
  format: string;
  pokemon?: string;
}

export interface StatsQuery {
  format: string;
  pokemon?: string;
  month?: string;
  rating?: number;
}

export interface TeamsQuery {
  format: string;
}

export interface AnalysesQuery {
  format?: string;
  pokemon?: string;
}

const FORMAT_REGEX = /^gen\d+[a-z0-9]+$/;
const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;
const POKEMON_REGEX = /^[a-zA-Z0-9\-']+$/;

export function validateFormat(req: Request, res: Response, next: NextFunction): void {
  const { format } = req.query;

  if (format && typeof format === 'string' && !FORMAT_REGEX.test(format)) {
    throw new ValidationError('Invalid format. Format should be like "gen9ou"', { format });
  }

  next();
}

export function validateSets(req: Request, res: Response, next: NextFunction): void {
  const { format, pokemon } = req.query;

  if (!format || typeof format !== 'string') {
    throw new ValidationError('Format is required', { format });
  }

  if (!FORMAT_REGEX.test(format)) {
    throw new ValidationError('Invalid format. Format should be like "gen9ou"', { format });
  }

  if (pokemon && typeof pokemon === 'string' && !POKEMON_REGEX.test(pokemon)) {
    throw new ValidationError('Invalid pokemon name', { pokemon });
  }

  next();
}

export function validateStats(req: Request, res: Response, next: NextFunction): void {
  const { format, pokemon, month, rating } = req.query;

  if (!format || typeof format !== 'string') {
    throw new ValidationError('Format is required', { format });
  }

  if (!FORMAT_REGEX.test(format)) {
    throw new ValidationError('Invalid format. Format should be like "gen9ou"', { format });
  }

  if (pokemon && typeof pokemon === 'string' && !POKEMON_REGEX.test(pokemon)) {
    throw new ValidationError('Invalid pokemon name', { pokemon });
  }

  if (month && typeof month === 'string' && !MONTH_REGEX.test(month)) {
    throw new ValidationError('Invalid month. Month should be in YYYY-MM format', { month });
  }

  if (rating !== undefined) {
    const ratingNum = parseInt(rating as string, 10);
    if (isNaN(ratingNum) || ratingNum < 0) {
      throw new ValidationError('Rating must be a positive number', { rating });
    }
  }

  next();
}

export function validateTeams(req: Request, res: Response, next: NextFunction): void {
  const { format } = req.query;

  if (!format || typeof format !== 'string') {
    throw new ValidationError('Format is required', { format });
  }

  if (!FORMAT_REGEX.test(format)) {
    throw new ValidationError('Invalid format. Format should be like "gen9ou"', { format });
  }

  next();
}

export function validateAnalyses(req: Request, res: Response, next: NextFunction): void {
  const { format, pokemon } = req.query;

  if (format && typeof format === 'string' && !FORMAT_REGEX.test(format)) {
    throw new ValidationError('Invalid format. Format should be like "gen9ou"', { format });
  }

  if (pokemon && typeof pokemon === 'string' && !POKEMON_REGEX.test(pokemon)) {
    throw new ValidationError('Invalid pokemon name', { pokemon });
  }

  next();
}
