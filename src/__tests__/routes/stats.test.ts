import request from 'supertest';
import app from '../../app';

describe('Stats Routes', () => {
  describe('GET /stats', () => {
    it('should return stats endpoint message', async () => {
      const response = await request(app).get('/stats');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});
