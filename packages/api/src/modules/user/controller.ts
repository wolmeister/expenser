import { UniqueIntegrityConstraintViolationError } from 'slonik';
import { hash } from 'bcryptjs';

import { ValidationsError } from '../../common/validations-error';
import { CreateUser, User, UserConstraints } from './model';
import { insertUser } from './service';

export async function addUser(user: CreateUser): Promise<User> {
  try {
    return await insertUser({
      name: user.name,
      email: user.email,
      password: await hash(user.password, 12),
    });
  } catch (err) {
    if (err instanceof UniqueIntegrityConstraintViolationError) {
      if (err.constraint === UserConstraints.UNIQUE_EMAIL) {
        throw new ValidationsError({
          msg: 'Value not unique',
          param: 'email',
          location: 'body',
          value: user.email,
        });
      }
    }
    throw err;
  }
}
