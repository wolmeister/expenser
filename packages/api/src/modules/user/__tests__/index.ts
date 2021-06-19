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

  describe('/users', () => {
    it('should return an error when name, email and password are not provided', done => {
      request(app)
        .post('/users')
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
                  msg: 'The user name is required',
                  param: 'name',
                  location: 'body',
                },
                {
                  msg: 'The user password is required',
                  param: 'password',
                  location: 'body',
                },
                {
                  msg: 'The user email is required and must be valid',
                  param: 'email',
                  location: 'body',
                },
              ],
            })
          );
          return done();
        });
    });

    it('should return an error when the email is invalid', done => {
      request(app)
        .post('/users')
        .send({
          name: 'User Test',
          email: 'test',
          password: '123',
        })
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
                  msg: 'The user email is required and must be valid',
                  param: 'email',
                  location: 'body',
                  value: 'test',
                },
              ],
            })
          );
          return done();
        });
    });

    // @TODO: sqlite3 errors are not the same as the postgres errors
    // it('should return an error when a user with the email already exists', done => {});

    it('should return the user when created successfully', done => {
      request(app)
        .post('/users')
        .send({
          name: 'User Test',
          email: 'user2@test.com',
          password: '123',
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toStrictEqual({
            id: expect.any(Number),
            name: 'User Test',
            email: 'user2@test.com',
          });
          return done();
        });
    });

    it('should not return the user password', done => {
      request(app)
        .post('/users')
        .send({
          name: 'User Test',
          email: 'user3@test.com',
          password: '123',
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.password).toBeUndefined();
          return done();
        });
    });
  });

  describe('/users/me', () => {
    it('should return an error if no users is authenticated', done => {
      request(app)
        .get('/users/me')
        .expect('Content-Type', /json/)
        .expect(401)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).toStrictEqual({
            message: 'Unauthorized',
            status: 401,
          });
          return done();
        });
    });

    // @TODO: Implement
    // it('should return the authenticated user', () => {});

    // @TODO: Implement
    // it('should not return the user password', () => {});
  });
});
