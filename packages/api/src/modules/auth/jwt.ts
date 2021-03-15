import { sign, verify } from 'jsonwebtoken';

type JwtPayload = {
  userId: number;
};

const DEFALT_JWT_SECRET = 'expenser';

export function signJwt(payload: JwtPayload): string {
  return sign(payload, process.env.JWT_SECRET || DEFALT_JWT_SECRET);
}

export function decodeJwt(token: string): JwtPayload {
  return verify(token, process.env.JWT_SECRET || DEFALT_JWT_SECRET) as JwtPayload;
}
