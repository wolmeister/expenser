import { UniqueViolationError } from 'objection';
import { hash } from 'bcryptjs';

import { ValidationsError } from '../../common/validations-error';
import { User, UserConstraints } from './model';

export async function addUser(user: User): Promise<User> {
  try {
    return await User.query().insert({
      name: user.name,
      email: user.email,
      password: await hash(user.password, 12),
    });
  } catch (err) {
    if (err instanceof UniqueViolationError) {
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
