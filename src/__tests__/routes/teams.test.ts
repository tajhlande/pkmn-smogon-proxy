import request from 'supertest';
import app from '../../app';

describe('Teams Routes', () => {
  describe('GET /teams', () => {
    it('should return teams endpoint message', async () => {
      const response = await request(app).get('/teams');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});
