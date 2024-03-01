import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Search Gym (e2e)', () => {

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it.skip('Shoul be able to search a gym', async () => {

    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JAVASCRIPT gym 2',
        description: 'some description',
        phone: '11999999999',
        latitude: -29.2092052,
        longitude: -49.6401091
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typecript',
        description: 'some description',
        phone: '11999999999',
        latitude: -29.2092052,
        longitude: -49.6401091
      });

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'JAVASCRIPT gym 2'
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JAVASCRIPT gym 2'
      })
    ]);
  });
});