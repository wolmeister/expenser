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
    res.send(await addUser(req.body));
  }
);

router.get('/users/me', isAuthenticated, async (req, res) => {
  res.send(await req.getUser());
});

export { router };
