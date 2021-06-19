import { StatusCodes } from 'http-status-codes';

import { HttpError } from '../../common/http-error';
import { User } from '../user';
import { Entry } from './model';
import {
  deleteEntryById,
  findEntriesByUserId,
  findEntryById,
  insertEntry,
  updateEntryById,
} from './service';

async function getEntryByidAndValidateUser(id: number, user: User): Promise<Entry> {
  const entry = await findEntryById(id);

  if (!entry) {
    throw new HttpError(StatusCodes.NOT_FOUND);
  }

  if (entry.userId !== user.id) {
    throw new HttpError(StatusCodes.FORBIDDEN);
  }

  return entry;
}

export async function addEntry(entry: Entry, user: User): Promise<Entry> {
  return insertEntry({
    userId: user.id,
    amount: entry.amount,
    category: entry.category,
    description: entry.description,
    date: entry.date,
  });
}

export async function updateEntry(id: number, entry: Entry, user: User): Promise<Entry> {
  await getEntryByidAndValidateUser(id, user);

  return updateEntryById(id, {
    amount: entry.amount,
    category: entry.category,
    description: entry.description,
    date: entry.date,
  });
}

export async function deleteEntry(id: number, user: User): Promise<Entry> {
  const entry = await getEntryByidAndValidateUser(id, user);
  const deleted = await deleteEntryById(id);

  if (!deleted) {
    throw new HttpError(StatusCodes.NOT_FOUND);
  }

  return entry;
}

export async function getEntryById(id: number, user: User): Promise<Entry> {
  return getEntryByidAndValidateUser(id, user);
}

export async function getEntries(user: User): Promise<readonly Entry[]> {
  return findEntriesByUserId(user.id);
}
