import request from 'supertest';
import { createMockPool, createMockQueryResult, QueryResultRowType } from 'slonik';
import { hash } from 'bcryptjs';

import { app } from '../../../app';
import { User } from '../../user';

// Mock slonik pool
let queryResultMock: QueryResultRowType[] = [];

const pool = createMockPool({
  query: async () => createMockQueryResult(queryResultMock),
});

jest.mock('../../../pg', () => ({
  get pgPool() {
    return pool;
  },
}));

describe('Auth Api', () => {
  let userMock: User;

  beforeAll(async () => {
    userMock = {
      id: 1,
      email: 'user@test.com',
      name: 'User Test',
      password: await hash('123', 12),
    };
  });

  describe('/auth', () => {
    queryResultMock = [];

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
      queryResultMock = [];

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
      queryResultMock = [userMock];

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
      queryResultMock = [userMock];

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
      queryResultMock = [userMock];

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
