import { SmogonService } from '../../services/smogonService';
import { CacheService } from '../../services/cacheService';
import { NotFoundError, ExternalApiError } from '../../errors';

jest.mock('@pkmn/smogon', () => {
  const mockSmogon = {
    analyses: jest.fn(),
    sets: jest.fn(),
    stats: jest.fn(),
    teams: jest.fn(),
  };
  return {
    Smogon: jest.fn().mockImplementation(() => mockSmogon),
  };
});

const { Smogon } = require('@pkmn/smogon');
const mockSmogon = new Smogon();

describe('SmogonService', () => {
  let service: SmogonService;
  let cache: CacheService;

  beforeEach(() => {
    cache = new CacheService(1000);
    service = new SmogonService(cache);
    jest.clearAllMocks();
  });

  afterEach(() => {
    cache.clear();
  });

  describe('getFormats', () => {
    it('should return list of available formats', async () => {
      const formats = await service.getFormats();
      expect(Array.isArray(formats)).toBe(true);
      expect(formats.length).toBeGreaterThan(0);
      expect(formats).toContain('gen9ou');
    });

    it('should cache formats', async () => {
      await service.getFormats();
      const cached = cache.get<string[]>('formats');
      expect(cached).not.toBeNull();
      expect(cached).toContain('gen9ou');
    });

    it('should return cached formats on second call', async () => {
      const formats1 = await service.getFormats();
      const formats2 = await service.getFormats();
      expect(formats1).toEqual(formats2);
    });
  });

  describe('getAnalyses', () => {
    it('should throw NotFoundError when pokemon is not provided', async () => {
      await expect(service.getAnalyses('gen9ou')).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError with correct message', async () => {
      await expect(service.getAnalyses('gen9ou')).rejects.toThrow('Pokemon name is required for analyses');
    });

    it('should return analyses from cache if available', async () => {
      const cachedAnalyses = [{ format: 'gen9ou', sets: {} }];
      cache.set('analyses:gen9ou:Charizard', cachedAnalyses);
      
      const result = await service.getAnalyses('gen9ou', 'Charizard');
      expect(result).toEqual(cachedAnalyses);
      expect(mockSmogon.analyses).not.toHaveBeenCalled();
    });

    it('should fetch and cache analyses', async () => {
      const mockAnalyses = [{ format: 'gen9ou', sets: {} }];
      mockSmogon.analyses.mockResolvedValueOnce(mockAnalyses);
      
      const result = await service.getAnalyses('gen9ou', 'Charizard');
      expect(result).toEqual(mockAnalyses);
      expect(mockSmogon.analyses).toHaveBeenCalled();
      expect(cache.get('analyses:gen9ou:Charizard')).toEqual(mockAnalyses);
    });

    it('should throw NotFoundError when analyses is empty', async () => {
      mockSmogon.analyses.mockResolvedValueOnce([]);
      
      await expect(service.getAnalyses('gen9ou', 'NonExistent')).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when analyses is null', async () => {
      mockSmogon.analyses.mockResolvedValueOnce(null);
      
      await expect(service.getAnalyses('gen9ou', 'NonExistent')).rejects.toThrow(NotFoundError);
    });

    it('should throw ExternalApiError on network error', async () => {
      mockSmogon.analyses.mockRejectedValueOnce(new Error('Network error'));
      
      await expect(service.getAnalyses('gen9ou', 'Charizard')).rejects.toThrow(ExternalApiError);
    });

    it('should handle format without gen prefix (defaults to gen 9)', async () => {
      const mockAnalyses = [{ format: 'ou', sets: {} }];
      mockSmogon.analyses.mockResolvedValueOnce(mockAnalyses);
      
      const result = await service.getAnalyses('ou', 'Charizard');
      expect(result).toEqual(mockAnalyses);
      expect(mockSmogon.analyses).toHaveBeenCalled();
    });
  });

  describe('getSets', () => {
    it('should throw NotFoundError when pokemon is not provided', async () => {
      await expect(service.getSets('gen9ou')).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError with correct message', async () => {
      await expect(service.getSets('gen9ou')).rejects.toThrow('Pokemon name is required for sets');
    });

    it('should return sets from cache if available', async () => {
      const cachedSets = [{ name: 'Test Set' }];
      cache.set('sets:gen9ou:Charizard', cachedSets);
      
      const result = await service.getSets('gen9ou', 'Charizard');
      expect(result).toEqual(cachedSets);
      expect(mockSmogon.sets).not.toHaveBeenCalled();
    });

    it('should fetch and cache sets', async () => {
      const mockSets = [{ name: 'Test Set' }];
      mockSmogon.sets.mockResolvedValueOnce(mockSets);
      
      const result = await service.getSets('gen9ou', 'Charizard');
      expect(result).toEqual(mockSets);
      expect(mockSmogon.sets).toHaveBeenCalled();
      expect(cache.get('sets:gen9ou:Charizard')).toEqual(mockSets);
    });

    it('should throw NotFoundError when sets is empty', async () => {
      mockSmogon.sets.mockResolvedValueOnce([]);
      
      await expect(service.getSets('gen9ou', 'NonExistent')).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when sets is null', async () => {
      mockSmogon.sets.mockResolvedValueOnce(null);
      
      await expect(service.getSets('gen9ou', 'NonExistent')).rejects.toThrow(NotFoundError);
    });

    it('should throw ExternalApiError on network error', async () => {
      mockSmogon.sets.mockRejectedValueOnce(new Error('Network error'));
      
      await expect(service.getSets('gen9ou', 'Charizard')).rejects.toThrow(ExternalApiError);
    });
  });

  describe('getStats', () => {
    it('should throw NotFoundError when pokemon is not provided', async () => {
      await expect(service.getStats('gen9ou')).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError with correct message', async () => {
      await expect(service.getStats('gen9ou')).rejects.toThrow('Pokemon name is required for stats');
    });

    it('should return stats from cache if available', async () => {
      const cachedStats = { usage: { raw: 100 } };
      cache.set('stats:gen9ou:Charizard:latest', cachedStats);
      
      const result = await service.getStats('gen9ou', 'Charizard');
      expect(result).toEqual(cachedStats);
      expect(mockSmogon.stats).not.toHaveBeenCalled();
    });

    it('should fetch and cache stats', async () => {
      const mockStats = { usage: { raw: 100 } };
      mockSmogon.stats.mockResolvedValueOnce(mockStats);
      
      const result = await service.getStats('gen9ou', 'Charizard');
      expect(result).toEqual(mockStats);
      expect(mockSmogon.stats).toHaveBeenCalled();
      expect(cache.get('stats:gen9ou:Charizard:latest')).toEqual(mockStats);
    });

    it('should throw NotFoundError when stats is null', async () => {
      mockSmogon.stats.mockResolvedValueOnce(null);
      
      await expect(service.getStats('gen9ou', 'NonExistent')).rejects.toThrow(NotFoundError);
    });

    it('should throw ExternalApiError on network error', async () => {
      mockSmogon.stats.mockRejectedValueOnce(new Error('Network error'));
      
      await expect(service.getStats('gen9ou', 'Charizard')).rejects.toThrow(ExternalApiError);
    });

    it('should use month in cache key', async () => {
      const mockStats = { usage: { raw: 100 } };
      mockSmogon.stats.mockResolvedValueOnce(mockStats);
      
      await service.getStats('gen9ou', 'Charizard', '2024-01');
      expect(cache.get('stats:gen9ou:Charizard:2024-01')).toEqual(mockStats);
    });
  });

  describe('getTeams', () => {
    it('should return teams from cache if available', async () => {
      const cachedTeams = [{ name: 'Test Team', data: [] }];
      cache.set('teams:gen9ou', cachedTeams);
      
      const result = await service.getTeams('gen9ou');
      expect(result).toEqual(cachedTeams);
      expect(mockSmogon.teams).not.toHaveBeenCalled();
    });

    it('should fetch and cache teams', async () => {
      const mockTeams = [{ name: 'Test Team', data: [] }];
      mockSmogon.teams.mockResolvedValueOnce(mockTeams);
      
      const result = await service.getTeams('gen9ou');
      expect(result).toEqual(mockTeams);
      expect(mockSmogon.teams).toHaveBeenCalled();
      expect(cache.get('teams:gen9ou')).toEqual(mockTeams);
    });

    it('should throw NotFoundError when teams is empty', async () => {
      mockSmogon.teams.mockResolvedValueOnce([]);
      
      await expect(service.getTeams('gen9ou')).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when teams is null', async () => {
      mockSmogon.teams.mockResolvedValueOnce(null);
      
      await expect(service.getTeams('gen9ou')).rejects.toThrow(NotFoundError);
    });

    it('should throw ExternalApiError on network error', async () => {
      mockSmogon.teams.mockRejectedValueOnce(new Error('Network error'));
      
      await expect(service.getTeams('gen9ou')).rejects.toThrow(ExternalApiError);
    });
  });
});
