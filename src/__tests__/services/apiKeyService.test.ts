import {
  generateApiKey,
  hashApiKey,
  validateApiKey,
  recordApiKeyUsage,
  getAllApiKeys,
  revokeApiKey,
  clearAllApiKeys,
} from '../../services/apiKeyService';

describe('ApiKeyService', () => {
  beforeEach(() => {
    clearAllApiKeys();
  });

  describe('generateApiKey', () => {
    it('should generate a valid API key with sk_ prefix', () => {
      const key = generateApiKey('test-key');
      expect(key).toMatch(/^sk_[a-f0-9]{64}$/);
    });

    it('should generate unique keys', () => {
      const key1 = generateApiKey('key1');
      const key2 = generateApiKey('key2');
      expect(key1).not.toBe(key2);
    });

    it('should store the key data', () => {
      const key = generateApiKey('test-key');
      const keyData = validateApiKey(key);
      expect(keyData).not.toBeNull();
      expect(keyData?.name).toBe('test-key');
      expect(keyData?.requestCount).toBe(0);
      expect(keyData?.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('hashApiKey', () => {
    it('should produce consistent hashes', () => {
      const rawKey = 'testkey123';
      const hash1 = hashApiKey(rawKey);
      const hash2 = hashApiKey(rawKey);
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different keys', () => {
      const hash1 = hashApiKey('key1');
      const hash2 = hashApiKey('key2');
      expect(hash1).not.toBe(hash2);
    });

    it('should produce 64 character hex string', () => {
      const hash = hashApiKey('testkey');
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('validateApiKey', () => {
    it('should return null for invalid key format', () => {
      expect(validateApiKey('invalid')).toBeNull();
      expect(validateApiKey('')).toBeNull();
      expect(validateApiKey('sk_invalid')).toBeNull();
    });

    it('should return null for non-existent key', () => {
      expect(validateApiKey('sk_0000000000000000000000000000000000000000000000000000000000000000')).toBeNull();
    });

    it('should return key data for valid key', () => {
      const key = generateApiKey('test');
      const keyData = validateApiKey(key);
      expect(keyData).not.toBeNull();
      expect(keyData?.name).toBe('test');
    });
  });

  describe('recordApiKeyUsage', () => {
    it('should increment request count', () => {
      const key = generateApiKey('test');
      const keyData1 = validateApiKey(key);
      expect(keyData1?.requestCount).toBe(0);

      const rawKey = key.slice(3);
      const hashedKey = hashApiKey(rawKey);
      recordApiKeyUsage(hashedKey);

      const keyData2 = validateApiKey(key);
      expect(keyData2?.requestCount).toBe(1);
      expect(keyData2?.lastUsedAt).toBeInstanceOf(Date);
    });

    it('should not fail for non-existent key', () => {
      expect(() => recordApiKeyUsage('nonexistent')).not.toThrow();
    });
  });

  describe('getAllApiKeys', () => {
    it('should return empty array when no keys', () => {
      expect(getAllApiKeys()).toEqual([]);
    });

    it('should return all keys without the key hash', () => {
      generateApiKey('key1');
      generateApiKey('key2');

      const keys = getAllApiKeys();
      expect(keys).toHaveLength(2);
      expect(keys[0]).not.toHaveProperty('key');
      expect(keys.map(k => k.name)).toContain('key1');
      expect(keys.map(k => k.name)).toContain('key2');
    });
  });

  describe('revokeApiKey', () => {
    it('should remove a key', () => {
      const key = generateApiKey('test');
      const rawKey = key.slice(3);
      const hashedKey = hashApiKey(rawKey);

      expect(validateApiKey(key)).not.toBeNull();

      const revoked = revokeApiKey(hashedKey);
      expect(revoked).toBe(true);
      expect(validateApiKey(key)).toBeNull();
    });

    it('should return false for non-existent key', () => {
      expect(revokeApiKey('nonexistent')).toBe(false);
    });
  });

  describe('clearAllApiKeys', () => {
    it('should remove all keys', () => {
      generateApiKey('key1');
      generateApiKey('key2');
      generateApiKey('key3');

      expect(getAllApiKeys()).toHaveLength(3);

      clearAllApiKeys();

      expect(getAllApiKeys()).toHaveLength(0);
    });
  });
});
