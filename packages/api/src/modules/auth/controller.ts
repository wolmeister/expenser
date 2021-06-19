import { compare } from 'bcryptjs';

import { ValidationsError } from '../../common/validations-error';
import { AuthRequest, AuthResponse } from './model';
import { findUserByEmail } from '../user';
import { signJwt } from './jwt';

export async function authenticate(authRequest: AuthRequest): Promise<AuthResponse> {
  const user = await findUserByEmail(authRequest.email);

  if (!user) {
    throw new ValidationsError({
      msg: 'Invalid value',
      param: 'email',
      location: 'body',
      value: authRequest.email,
    });
  }

  if (await compare(authRequest.password, user.password)) {
    // @TODO: Improve this
    const userWithoutPassword = {
      ...user,
      password: undefined,
    };
    return {
      token: signJwt({ userId: user.id }),
      user: userWithoutPassword,
    };
  }

  throw new ValidationsError({
    msg: 'Invalid value',
    param: 'password',
    location: 'body',
    value: null,
  });
}
