import { compare } from 'bcryptjs';

import { ValidationsError } from '../../common/validations-error';
import { AuthRequest, AuthResponse } from './model';
import { User } from '../user';
import { signJwt } from './jwt';

export async function authenticate(authRequest: AuthRequest): Promise<AuthResponse> {
  const user = await User.query().findOne({ email: authRequest.email });

  if (!user) {
    throw new ValidationsError({
      msg: 'Invalid value',
      param: 'email',
      location: 'body',
      value: authRequest.email,
    });
  }

  if (await compare(authRequest.password, user.password)) {
    return {
      token: signJwt({ userId: user.id }),
      user,
    };
  }

  throw new ValidationsError({
    msg: 'Invalid value',
    param: 'password',
    location: 'body',
    value: null,
  });
}
