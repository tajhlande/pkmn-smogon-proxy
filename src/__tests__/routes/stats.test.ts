import request from 'supertest';
import app from '../../app';

describe('Stats Routes', () => {
  describe('GET /stats', () => {
    it('should return validation error when format is missing', async () => {
      const response = await request(app).get('/stats');
      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return validation error for invalid format', async () => {
      const response = await request(app)
        .get('/stats')
        .query({ format: 'invalid' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return validation error for invalid month format', async () => {
      const response = await request(app)
        .get('/stats')
        .query({ format: 'gen9ou', month: '2024-13' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return validation error for invalid rating', async () => {
      const response = await request(app)
        .get('/stats')
        .query({ format: 'gen9ou', rating: '-100' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });
});
