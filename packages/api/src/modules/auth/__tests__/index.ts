import request from 'supertest';
import { Model } from 'objection';

import { app } from '../../../app';
import { knex } from '../../../knex';

describe('Auth Api', () => {
  beforeAll(async () => {
    Model.knex(knex);
    await knex.migrate.latest();
    await knex.seed.run();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  describe('/auth', () => {
    it('should return an error when email and password are not provided', done => {
      request(app)
        .post('/auth')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toStrictEqual(
            expect.objectContaining({
              errors: [
                {
                  msg: 'The password is required',
                  param: 'password',
                  location: 'body',
                },
                {
                  msg: 'The email is required and must be valid',
                  param: 'email',
                  location: 'body',
                },
              ],
            })
          );
          return done();
        });
    });

    it('should return an error when no user with the email exists', done => {
      request(app)
        .post('/auth')
        .send({ email: 'user2@test.com', password: '123' })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toStrictEqual(
            expect.objectContaining({
              errors: [
                {
                  msg: 'Invalid value',
                  param: 'email',
                  location: 'body',
                  value: 'user2@test.com',
                },
              ],
            })
          );
          return done();
        });
    });

    it('should return an error when the password is incorrect', done => {
      request(app)
        .post('/auth')
        .send({ email: 'user@test.com', password: '12' })
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toStrictEqual(
            expect.objectContaining({
              errors: [
                {
                  msg: 'Invalid value',
                  param: 'password',
                  location: 'body',
                  value: null,
                },
              ],
            })
          );
          return done();
        });
    });

    it('should return the token and the user when authenticated successfully', done => {
      request(app)
        .post('/auth')
        .send({ email: 'user@test.com', password: '123' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toStrictEqual({
            token: expect.any(String),
            user: expect.objectContaining({
              email: 'user@test.com',
            }),
          });
          return done();
        });
    });

    it('should not return the user password', done => {
      request(app)
        .post('/auth')
        .send({ email: 'user@test.com', password: '123' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.user.password).toBeUndefined();
          return done();
        });
    });
  });
});
