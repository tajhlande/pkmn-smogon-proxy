import request from 'supertest';
import app from '../../app';

describe('Analyses Routes', () => {
  describe('GET /analyses', () => {
    it('should return validation error when pokemon is missing', async () => {
      const response = await request(app)
        .get('/analyses')
        .query({ format: 'gen9ou' });
      
      expect(response.status).toBe(404);
      expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    });

    it('should return validation error for invalid format', async () => {
      const response = await request(app)
        .get('/analyses')
        .query({ format: 'invalid', pokemon: 'Charizard' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return validation error for invalid pokemon name', async () => {
      const response = await request(app)
        .get('/analyses')
        .query({ format: 'gen9ou', pokemon: 'invalid@#$' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });
});
