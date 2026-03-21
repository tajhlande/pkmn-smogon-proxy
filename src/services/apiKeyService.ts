import { randomBytes, createHash } from 'crypto';

export interface ApiKeyData {
  key: string;
  name: string;
  createdAt: Date;
  lastUsedAt?: Date;
  requestCount: number;
}

const API_KEYS: Map<string, ApiKeyData> = new Map();

export function generateApiKey(name: string): string {
  const rawKey = randomBytes(32).toString('hex');
  const hashedKey = hashApiKey(rawKey);
  
  const keyData: ApiKeyData = {
    key: hashedKey,
    name,
    createdAt: new Date(),
    requestCount: 0,
  };
  
  API_KEYS.set(hashedKey, keyData);
  
  return `sk_${rawKey}`;
}

export function hashApiKey(rawKey: string): string {
  return createHash('sha256').update(rawKey).digest('hex');
}

export function validateApiKey(apiKey: string): ApiKeyData | null {
  if (!apiKey || !apiKey.startsWith('sk_')) {
    return null;
  }
  
  const rawKey = apiKey.slice(3);
  const hashedKey = hashApiKey(rawKey);
  const keyData = API_KEYS.get(hashedKey);
  
  if (!keyData) {
    return null;
  }
  
  return keyData;
}

export function recordApiKeyUsage(hashedKey: string): void {
  const keyData = API_KEYS.get(hashedKey);
  if (keyData) {
    keyData.lastUsedAt = new Date();
    keyData.requestCount++;
  }
}

export function getAllApiKeys(): Omit<ApiKeyData, 'key'>[] {
  return Array.from(API_KEYS.values()).map(({ key: _, ...rest }) => rest);
}

export function revokeApiKey(hashedKey: string): boolean {
  return API_KEYS.delete(hashedKey);
}

export function clearAllApiKeys(): void {
  API_KEYS.clear();
}
