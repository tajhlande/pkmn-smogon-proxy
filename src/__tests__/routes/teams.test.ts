import request from 'supertest';
import app from '../../app';

describe('Teams Routes', () => {
  describe('GET /teams', () => {
    it('should return validation error when format is missing', async () => {
      const response = await request(app).get('/teams');
      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return validation error for invalid format', async () => {
      const response = await request(app)
        .get('/teams')
        .query({ format: 'invalid' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });
});
