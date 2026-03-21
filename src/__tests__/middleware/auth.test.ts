import request from 'supertest';
import express, { Application } from 'express';
import { requireApiKey, optionalApiKey } from '../../middleware/auth';
import { generateApiKey, clearAllApiKeys } from '../../services/apiKeyService';
import { errorHandler } from '../../middleware/errorHandler';

describe('Auth Middleware', () => {
  let app: Application;

  beforeEach(() => {
    clearAllApiKeys();
    app = express();
    app.use(express.json());
  });

  describe('requireApiKey', () => {
    beforeEach(() => {
      app.get('/protected', requireApiKey, (req, res) => {
        res.json({ message: 'success', apiKey: req.apiKey });
      });
      app.use(errorHandler);
    });

    describe('when API_KEY_REQUIRED is not set', () => {
      it('should allow access without API key', async () => {
        const originalEnv = process.env.API_KEY_REQUIRED;
        delete process.env.API_KEY_REQUIRED;

        const response = await request(app).get('/protected');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('success');

        process.env.API_KEY_REQUIRED = originalEnv;
      });
    });

    describe('when API_KEY_REQUIRED is false', () => {
      it('should allow access without API key', async () => {
        const originalEnv = process.env.API_KEY_REQUIRED;
        process.env.API_KEY_REQUIRED = 'false';

        const response = await request(app).get('/protected');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('success');

        process.env.API_KEY_REQUIRED = originalEnv;
      });
    });

    describe('when API_KEY_REQUIRED is true', () => {
      beforeEach(() => {
        process.env.API_KEY_REQUIRED = 'true';
      });

      afterEach(() => {
        delete process.env.API_KEY_REQUIRED;
      });

      it('should reject requests without API key', async () => {
        const response = await request(app).get('/protected');
        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe('AUTHENTICATION_ERROR');
      });

      it('should accept valid API key in Authorization header', async () => {
        const key = generateApiKey('test-key');

        const response = await request(app)
          .get('/protected')
          .set('Authorization', `Bearer ${key}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('success');
        expect(response.body.apiKey.name).toBe('test-key');
      });

      it('should accept valid API key in query parameter', async () => {
        const key = generateApiKey('test-key');

        const response = await request(app)
          .get(`/protected?api_key=${key}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('success');
      });

      it('should reject invalid API key', async () => {
        const response = await request(app)
          .get('/protected')
          .set('Authorization', 'Bearer sk_invalid');

        expect(response.status).toBe(401);
        expect(response.body.error.code).toBe('AUTHENTICATION_ERROR');
      });

      it('should reject malformed Authorization header', async () => {
        const response = await request(app)
          .get('/protected')
          .set('Authorization', 'InvalidFormat');

        expect(response.status).toBe(401);
      });
    });
  });

  describe('optionalApiKey', () => {
    beforeEach(() => {
      app.get('/optional', optionalApiKey, (req, res) => {
        res.json({ message: 'success', apiKey: req.apiKey || null });
      });
      app.use(errorHandler);
    });

    it('should allow access without API key', async () => {
      const response = await request(app).get('/optional');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('success');
      expect(response.body.apiKey).toBeNull();
    });

    it('should attach API key data when valid key provided', async () => {
      const key = generateApiKey('test-key');

      const response = await request(app)
        .get('/optional')
        .set('Authorization', `Bearer ${key}`);

      expect(response.status).toBe(200);
      expect(response.body.apiKey).not.toBeNull();
      expect(response.body.apiKey.name).toBe('test-key');
    });

    it('should not fail for invalid API key', async () => {
      const response = await request(app)
        .get('/optional')
        .set('Authorization', 'Bearer sk_invalid');

      expect(response.status).toBe(200);
      expect(response.body.apiKey).toBeNull();
    });
  });
});
