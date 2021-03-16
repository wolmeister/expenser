import { Router } from 'express';
import { body, param } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

import { isAuthenticated } from '../../common/authenticated';
import { validate } from '../../common/validate';
import { addEntry, updateEntry, deleteEntry, getEntryById, getEntries } from './controller';

const router = Router();

router.post(
  '/entries',
  isAuthenticated,
  validate([
    body('amount', 'The amount is required and must be a number').isNumeric(),
    body('category', 'The category is required and must be a string').notEmpty(),
    body('description', 'The description must be a string').optional().isString(),
    body('date', 'The date is required and must be a valid date').isISO8601(),
  ]),
  async (req, res) => {
    res.send(await addEntry(req.body, await req.getUser()));
  }
);

router.put(
  '/entries/:id',
  validate([
    body('amount', 'The amount is required and must be a number').isNumeric(),
    body('category', 'The category is required and must be a string').notEmpty(),
    body('description', 'The description must be a string').optional().isString(),
    body('date', 'The date is required and must be a valid date').isISO8601(),
    param('id', 'The entry id must be an int').isInt(),
  ]),
  isAuthenticated,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);
    res.send(await updateEntry(id, req.body, await req.getUser()));
  }
);

router.delete(
  '/entries/:id',
  isAuthenticated,
  validate([param('id', 'The entry id must be an int').isInt()]),
  async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await deleteEntry(id, await req.getUser());
    res.sendStatus(StatusCodes.OK);
  }
);

router.get(
  '/entries/:id',
  isAuthenticated,
  validate([param('id', 'The entry id must be an int').isInt()]),
  async (req, res) => {
    const id = parseInt(req.params.id, 10);
    res.send(await getEntryById(id, await req.getUser()));
  }
);

router.get('/entries', isAuthenticated, async (req, res) => {
  res.send(await getEntries(await req.getUser()));
});

export { router };
