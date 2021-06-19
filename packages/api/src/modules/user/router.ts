import { Router } from 'express';
import { body } from 'express-validator';
import { isAuthenticated } from '../../common/authenticated';

import { validate } from '../../common/validate';
import { addUser } from './controller';

const router = Router();

router.post(
  '/users',
  validate([
    body('name', 'The user name is required').notEmpty(),
    body('email', 'The user email is required and must be valid')
      .notEmpty()
      .isEmail()
      .normalizeEmail(),
    body('password', 'The user password is required').notEmpty(),
  ]),
  async (req, res) => {
    // @TODO: Improve this
    const user = await addUser(req.body);
    res.send({
      ...user,
      password: undefined,
    });
  }
);

router.get('/users/me', isAuthenticated, async (req, res) => {
  // @TODO: Improve this
  const user = await req.getUser();
  res.send({
    ...user,
    password: undefined,
  });
});

export { router };
