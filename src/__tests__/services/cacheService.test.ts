import { CacheService } from '../../services/cacheService';

describe('CacheService', () => {
  let cache: CacheService;

  beforeEach(() => {
    cache = new CacheService(1000);
  });

  afterEach(() => {
    cache.clear();
  });

  describe('get', () => {
    it('should return cached data if exists', () => {
      cache.set('test-key', { data: 'test-value' });
      const result = cache.get<{ data: string }>('test-key');
      expect(result).toEqual({ data: 'test-value' });
    });

    it('should return null if data not cached', () => {
      const result = cache.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should return null if TTL has expired', async () => {
      cache.set('test-key', 'test-value', 10);
      await new Promise(resolve => setTimeout(resolve, 20));
      const result = cache.get('test-key');
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should cache data with TTL', () => {
      cache.set('test-key', 'test-value', 1000);
      expect(cache.has('test-key')).toBe(true);
    });

    it('should use default TTL if not specified', () => {
      const defaultCache = new CacheService(1000);
      defaultCache.set('test-key', 'test-value');
      expect(defaultCache.has('test-key')).toBe(true);
    });
  });

  describe('delete', () => {
    it('should delete cached data', () => {
      cache.set('test-key', 'test-value');
      expect(cache.delete('test-key')).toBe(true);
      expect(cache.get('test-key')).toBeNull();
    });

    it('should return false if key does not exist', () => {
      expect(cache.delete('non-existent-key')).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all cached data', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      expect(cache.size()).toBe(0);
    });
  });

  describe('has', () => {
    it('should return true if key exists and not expired', () => {
      cache.set('test-key', 'test-value');
      expect(cache.has('test-key')).toBe(true);
    });

    it('should return false if key does not exist', () => {
      expect(cache.has('non-existent-key')).toBe(false);
    });

    it('should return false if TTL has expired', async () => {
      cache.set('test-key', 'test-value', 10);
      await new Promise(resolve => setTimeout(resolve, 20));
      expect(cache.has('test-key')).toBe(false);
    });
  });

  describe('size', () => {
    it('should return the number of cached items', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      expect(cache.size()).toBe(2);
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      const stats = cache.getStats();
      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('key1');
      expect(stats.keys).toContain('key2');
    });
  });
});
