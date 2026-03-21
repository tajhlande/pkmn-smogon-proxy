import request from 'supertest';
import app from '../../app';

describe('Analyses Routes', () => {
  describe('GET /analyses', () => {
    it('should return analyses endpoint message', async () => {
      const response = await request(app).get('/analyses');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});
