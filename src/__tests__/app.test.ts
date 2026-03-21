import request from 'supertest';
import app from '../app';

describe('Root Endpoint', () => {
  it('should return API information', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('endpoints');
    expect(response.body.endpoints).toHaveProperty('analyses');
    expect(response.body.endpoints).toHaveProperty('formats');
    expect(response.body.endpoints).toHaveProperty('sets');
    expect(response.body.endpoints).toHaveProperty('stats');
    expect(response.body.endpoints).toHaveProperty('teams');
  });
});
