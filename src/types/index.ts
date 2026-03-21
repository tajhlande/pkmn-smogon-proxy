export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface SmogonQueryParams {
  format?: string;
  pokemon?: string;
  month?: string;
  rating?: number;
}

export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: Record<string, unknown>;
  };
}

import type { PokemonSet } from '@pkmn/data';

export type { Analysis, DisplayStatistics, DisplayUsageStatistics } from '@pkmn/smogon';

export interface Team {
  name?: string;
  author?: string;
  data: PokemonSet[];
}
