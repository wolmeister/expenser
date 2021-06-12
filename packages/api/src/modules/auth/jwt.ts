import { sign, verify } from 'jsonwebtoken';
import { getEnv } from '../../env';

type JwtPayload = {
  userId: number;
};

const DEFALT_JWT_SECRET = 'expenser';

export function signJwt(payload: JwtPayload): string {
  return sign(payload, getEnv('JWT_SECRET') || DEFALT_JWT_SECRET);
}

export function decodeJwt(token: string): JwtPayload {
  return verify(token, getEnv('JWT_SECRET') || DEFALT_JWT_SECRET) as JwtPayload;
}
