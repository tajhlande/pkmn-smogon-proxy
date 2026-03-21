import request from 'supertest';
import app from '../../app';

describe('Formats Routes', () => {
  describe('GET /formats', () => {
    it('should return formats endpoint message', async () => {
      const response = await request(app).get('/formats');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});
