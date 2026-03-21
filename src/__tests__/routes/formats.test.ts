import request from 'supertest';
import app from '../../app';

describe('Formats Routes', () => {
  describe('GET /formats', () => {
    it('should return list of formats', async () => {
      const response = await request(app).get('/formats');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body).toContain('gen9ou');
    });

    it('should return validation error for invalid format', async () => {
      const response = await request(app)
        .get('/formats')
        .query({ format: 'invalid' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });
});
