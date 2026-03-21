import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '../errors';
import { validateApiKey, hashApiKey, recordApiKeyUsage } from '../services/apiKeyService';

declare global {
  namespace Express {
    interface Request {
      apiKey?: {
        name: string;
        requestCount: number;
      };
    }
  }
}

export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKeyRequired = process.env.API_KEY_REQUIRED === 'true';
  
  if (!apiKeyRequired) {
    return next();
  }
  
  const authHeader = req.headers.authorization;
  const queryKey = req.query.api_key as string | undefined;
  
  let apiKey: string | undefined;
  
  if (authHeader?.startsWith('Bearer ')) {
    apiKey = authHeader.slice(7);
  } else if (queryKey) {
    apiKey = queryKey;
  }
  
  if (!apiKey) {
    throw new AuthenticationError('API key is required. Provide via Authorization header or api_key query parameter.');
  }
  
  const keyData = validateApiKey(apiKey);
  
  if (!keyData) {
    throw new AuthenticationError('Invalid API key.');
  }
  
  recordApiKeyUsage(hashApiKey(apiKey.slice(3)));
  
  req.apiKey = {
    name: keyData.name,
    requestCount: keyData.requestCount,
  };
  
  next();
}

export function optionalApiKey(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const queryKey = req.query.api_key as string | undefined;
  
  let apiKey: string | undefined;
  
  if (authHeader?.startsWith('Bearer ')) {
    apiKey = authHeader.slice(7);
  } else if (queryKey) {
    apiKey = queryKey;
  }
  
  if (apiKey) {
    const keyData = validateApiKey(apiKey);
    
    if (keyData) {
      recordApiKeyUsage(hashApiKey(apiKey.slice(3)));
      req.apiKey = {
        name: keyData.name,
        requestCount: keyData.requestCount,
      };
    }
  }
  
  next();
}
