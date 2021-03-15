import { Router } from 'express';
import { body } from 'express-validator';

import { validate } from '../../common/validate';
import { authenticate } from './controller';

const router = Router();

router.post(
  '/auth',
  validate([body('email').isEmail().normalizeEmail(), body('password').notEmpty()]),
  async (req, res) => {
    res.send(await authenticate(req.body));
  }
);

export { router };
