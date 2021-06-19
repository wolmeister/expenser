import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { decodeJwt } from '../modules/auth';
import { findUserById } from '../modules/user';
import { HttpError } from './http-error';

export async function isAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new HttpError(StatusCodes.UNAUTHORIZED));
    return;
  }

  const token = authHeader.substring('Bearer '.length);

  try {
    const payload = decodeJwt(token);
    req.getUser = () => findUserById(payload.userId);
    next();
  } catch (err) {
    next(new HttpError(StatusCodes.UNAUTHORIZED));
  }
}
