import request from 'supertest';
import app from '../app';

jest.mock('../services/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('App', () => {
  describe('GET /', () => {
    it('should return API info', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Smogon API Proxy');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('documentation', '/api-docs');
      expect(response.body.endpoints).toHaveProperty('formats');
      expect(response.body.endpoints).toHaveProperty('sets');
      expect(response.body.endpoints).toHaveProperty('stats');
      expect(response.body.endpoints).toHaveProperty('teams');
      expect(response.body.endpoints).toHaveProperty('analyses');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api-docs', () => {
    it('should return API documentation', async () => {
      const response = await request(app).get('/api-docs');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('openapi', '3.0.0');
      expect(response.body).toHaveProperty('info');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body).toHaveProperty('rateLimit');
    });

    it('should include all endpoints in documentation', async () => {
      const response = await request(app).get('/api-docs');
      expect(response.body.endpoints).toHaveProperty('formats');
      expect(response.body.endpoints).toHaveProperty('analyses');
      expect(response.body.endpoints).toHaveProperty('sets');
      expect(response.body.endpoints).toHaveProperty('stats');
      expect(response.body.endpoints).toHaveProperty('teams');
    });

    it('should include examples for each endpoint', async () => {
      const response = await request(app).get('/api-docs');
      expect(response.body.endpoints.formats).toHaveProperty('example');
      expect(response.body.endpoints.analyses).toHaveProperty('example');
      expect(response.body.endpoints.sets).toHaveProperty('example');
      expect(response.body.endpoints.stats).toHaveProperty('example');
      expect(response.body.endpoints.teams).toHaveProperty('example');
    });

    it('should include rate limit configuration', async () => {
      const response = await request(app).get('/api-docs');
      expect(response.body.rateLimit).toHaveProperty('windowMs');
      expect(response.body.rateLimit).toHaveProperty('max');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      expect(response.status).toBe(404);
      expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    });
  });
});
