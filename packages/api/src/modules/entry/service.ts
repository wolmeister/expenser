import { sql } from 'slonik';

import { pgPool } from '../../pg';
import { CreateEntry, Entry, UpdateEntry } from './model';

export async function insertEntry(entry: CreateEntry): Promise<Entry> {
  const result = await pgPool.query<Entry>(sql`
    INSERT INTO entries ("userId", amount, category, description, date)
    VALUES (
      ${entry.userId},
      ${entry.amount},
      ${entry.category},
      ${entry.description || null},
      ${entry.date}
    )
    RETURNING *
  `);
  return result.rows[0];
}

export async function updateEntryById(id: number, entry: UpdateEntry): Promise<Entry> {
  const result = await pgPool.query<Entry>(sql`
    UPDATE entries
      SET 
        amount = ${entry.amount},
        category = ${entry.category},
        description = ${entry.description || null},
        date = ${entry.date}
    WHERE
      id = ${id}
    RETURNING *
  `);
  return result.rows[0];
}

export async function deleteEntryById(id: number): Promise<boolean> {
  const result = await pgPool.query(sql`
    DELETE FROM entries
    WHERE
      id = ${id}
  `);
  return result.rowCount === 1;
}

export async function findEntryById(id: number): Promise<Entry | null> {
  return pgPool.maybeOne(sql`
    SELECT * FROM entries
    WHERE id = ${id}
  `);
}

export async function findEntriesByUserId(userId: number): Promise<readonly Entry[]> {
  return pgPool.any(sql`
    SELECT * FROM entries
    WHERE "userId" = ${userId}
    ORDER BY
      date desc,
      category desc,
      id desc
  `);
}
