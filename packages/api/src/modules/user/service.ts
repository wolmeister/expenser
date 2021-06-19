import { sql } from 'slonik';

import { pgPool } from '../../pg';
import { CreateUser, User } from './model';

export async function insertUser(user: CreateUser): Promise<User> {
  const result = await pgPool.query<User>(sql`
    INSERT INTO users (name, email, password)
    VALUES (${user.name}, ${user.email}, ${user.password})
    RETURNING *
  `);
  return result.rows[0];
}

export async function findUserById(id: number): Promise<User> {
  return pgPool.one(sql`
    SELECT * FROM users
    WHERE id = ${id}
  `);
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return pgPool.maybeOne(sql`
    SELECT * FROM users
    WHERE email = ${email}
  `);
}
