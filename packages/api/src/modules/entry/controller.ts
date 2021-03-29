import { StatusCodes } from 'http-status-codes';

import { HttpError } from '../../common/http-error';
import { User } from '../user';
import { Entry } from './model';

async function getEntryByidAndValidateUser(id: number, user: User): Promise<Entry> {
  const entry = await Entry.query().findById(id);

  if (!entry) {
    throw new HttpError(StatusCodes.NOT_FOUND);
  }

  if (entry.userId !== user.id) {
    throw new HttpError(StatusCodes.FORBIDDEN);
  }

  return entry;
}

export async function addEntry(entry: Entry, user: User): Promise<Entry> {
  return Entry.query().insert({
    userId: user.id,
    amount: entry.amount,
    category: entry.category,
    description: entry.description,
    date: entry.date,
  });
}

export async function updateEntry(id: number, entry: Entry, user: User): Promise<Entry> {
  await getEntryByidAndValidateUser(id, user);

  return Entry.query().updateAndFetchById(id, {
    amount: entry.amount,
    category: entry.category,
    description: entry.description,
    date: entry.date,
  });
}

export async function deleteEntry(id: number, user: User): Promise<Entry> {
  const entry = await getEntryByidAndValidateUser(id, user);
  const deleted = await Entry.query().deleteById(id);

  if (!deleted) {
    throw new HttpError(StatusCodes.NOT_FOUND);
  }

  return entry;
}

export async function getEntryById(id: number, user: User): Promise<Entry> {
  return getEntryByidAndValidateUser(id, user);
}

export async function getEntries(user: User): Promise<Entry[]> {
  return Entry.query()
    .where('userId', user.id)
    .orderBy('date', 'desc')
    .orderBy('category', 'desc')
    .orderBy('id', 'desc');
}
