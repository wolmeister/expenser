import { Router } from 'express';
import { body } from 'express-validator';

import { validate } from '../../common/validate';
import { authenticate } from './controller';

const router = Router();

router.post(
  '/auth',
  validate([
    body('email', 'The email is required and must be valid').isEmail().normalizeEmail(),
    body('password', 'The password is required').notEmpty(),
  ]),
  async (req, res) => {
    res.send(await authenticate(req.body));
  }
);

export { router };
