import request from 'supertest';
import app from '../../app';

describe('Sets Routes', () => {
  describe('GET /sets', () => {
    it('should return sets endpoint message', async () => {
      const response = await request(app).get('/sets');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});
