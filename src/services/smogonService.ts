import { Dex } from '@pkmn/dex';
import { Generations, ID } from '@pkmn/data';
import { Smogon, Analysis, DisplayStatistics } from '@pkmn/smogon';
import { Team } from '../types';
import { CacheService } from './cacheService';
import { ExternalApiError, NotFoundError } from '../errors';

const gens = new Generations(Dex);
const smogon = new Smogon(fetch, true);

const GENERATION_MAP: Record<string, number> = {
  'gen1': 1, 'gen2': 2, 'gen3': 3, 'gen4': 4,
  'gen5': 5, 'gen6': 6, 'gen7': 7, 'gen8': 8, 'gen9': 9,
};

function parseGeneration(format: string): number {
  const genMatch = format.match(/^gen(\d)/);
  if (!genMatch) return 9;
  return parseInt(genMatch[1], 10);
}

function toId(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export class SmogonService {
  private cache: CacheService;

  constructor(cache: CacheService) {
    this.cache = cache;
  }

  async getFormats(): Promise<string[]> {
    const cacheKey = 'formats';
    const cached = this.cache.get<string[]>(cacheKey);
    if (cached) return cached;

    const formats = [
      'gen9ou', 'gen9ubers', 'gen9uu', 'gen9ru', 'gen9nu', 'gen9pu', 'gen9lc',
      'gen9vgc2025regh', 'gen9vgc2024rege', 'gen9vgc2024regg',
      'gen8ou', 'gen8ubers', 'gen8uu', 'gen8ru', 'gen8nu', 'gen8pu',
      'gen8vgc2022', 'gen8vgc2021', 'gen8battlespotsingles',
      'gen7ou', 'gen7ubers', 'gen7uu', 'gen7ru', 'gen7nu', 'gen7pu',
      'gen7vgc2019', 'gen7battlespotsingles',
      'gen6ou', 'gen6ubers', 'gen6uu', 'gen6ru', 'gen6nu', 'gen6pu',
      'gen6vgc2016', 'gen6battlespotsingles',
      'gen5ou', 'gen5ubers', 'gen5uu', 'gen5ru', 'gen5nu', 'gen5pu',
      'gen4ou', 'gen4ubers', 'gen4uu', 'gen4nu', 'gen4pu',
      'gen3ou', 'gen3ubers', 'gen3uu', 'gen3nu',
      'gen2ou', 'gen2uu', 'gen2nu',
      'gen1ou', 'gen1uu', 'gen1nu',
      'gen9nationaldex', 'gen9balancedhackmons', 'gen9anythinggoes',
    ];
    
    this.cache.set(cacheKey, formats, 86400000);
    return formats;
  }

  async getAnalyses(format: string, pokemon?: string): Promise<Analysis[]> {
    const cacheKey = `analyses:${format}:${pokemon || 'all'}`;
    const cached = this.cache.get<Analysis[]>(cacheKey);
    if (cached) return cached;

    try {
      const genNum = parseGeneration(format);
      const gen = gens.get(genNum);
      
      if (pokemon) {
        const analyses = await smogon.analyses(gen, pokemon, toId(format) as ID);
        if (!analyses || analyses.length === 0) {
          throw new NotFoundError(`No analyses found for ${pokemon} in ${format}`);
        }
        this.cache.set(cacheKey, analyses);
        return analyses;
      }

      throw new NotFoundError('Pokemon name is required for analyses');
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new ExternalApiError('Failed to fetch analyses', { error: String(error) });
    }
  }

  async getSets(format: string, pokemon?: string): Promise<unknown[]> {
    const cacheKey = `sets:${format}:${pokemon || 'all'}`;
    const cached = this.cache.get<unknown[]>(cacheKey);
    if (cached) return cached;

    try {
      const genNum = parseGeneration(format);
      const gen = gens.get(genNum);
      
      if (pokemon) {
        const sets = await smogon.sets(gen, pokemon, toId(format) as ID);
        if (!sets || sets.length === 0) {
          throw new NotFoundError(`No sets found for ${pokemon} in ${format}`);
        }
        this.cache.set(cacheKey, sets);
        return sets;
      }

      throw new NotFoundError('Pokemon name is required for sets');
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new ExternalApiError('Failed to fetch sets', { error: String(error) });
    }
  }

  async getStats(format: string, pokemon?: string, _month?: string, _rating?: number): Promise<DisplayStatistics | unknown> {
    const cacheKey = `stats:${format}:${pokemon || 'all'}:${_month || 'latest'}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    try {
      const genNum = parseGeneration(format);
      const gen = gens.get(genNum);
      
      if (pokemon) {
        const stats = await smogon.stats(gen, pokemon, toId(format) as ID);
        if (!stats) {
          throw new NotFoundError(`No stats found for ${pokemon} in ${format}`);
        }
        this.cache.set(cacheKey, stats);
        return stats;
      }

      throw new NotFoundError('Pokemon name is required for stats');
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new ExternalApiError('Failed to fetch stats', { error: String(error) });
    }
  }

  async getTeams(format: string): Promise<Team[]> {
    const cacheKey = `teams:${format}`;
    const cached = this.cache.get<Team[]>(cacheKey);
    if (cached) return cached;

    try {
      const teams = await smogon.teams(toId(format) as any);
      if (!teams || teams.length === 0) {
        throw new NotFoundError(`No teams found for ${format}`);
      }
      this.cache.set(cacheKey, teams);
      return teams;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new ExternalApiError('Failed to fetch teams', { error: String(error) });
    }
  }
}

export const smogonService = new SmogonService(new CacheService());
