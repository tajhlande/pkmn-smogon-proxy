import request from 'supertest';
import app from '../../app';

describe('Sets Routes', () => {
  describe('GET /sets', () => {
    it('should return validation error when format is missing', async () => {
      const response = await request(app).get('/sets');
      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return validation error for invalid format', async () => {
      const response = await request(app)
        .get('/sets')
        .query({ format: 'invalid', pokemon: 'Charizard' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return validation error for invalid pokemon name', async () => {
      const response = await request(app)
        .get('/sets')
        .query({ format: 'gen9ou', pokemon: 'invalid@#$' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });
});
