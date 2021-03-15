import { Router } from 'express';
import { body } from 'express-validator';
import { isAuthenticated } from '../../common/authenticated';

import { validate } from '../../common/validate';
import { addUser } from './controller';

const router = Router();

router.post(
  '/users',
  validate([
    body('name').notEmpty(),
    body('email').notEmpty().isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ]),
  async (req, res) => {
    res.send(await addUser(req.body));
  }
);

router.get('/users/me', isAuthenticated, async (req, res) => {
  res.send(await req.getUser());
});

export { router };
