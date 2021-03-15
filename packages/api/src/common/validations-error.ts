import { ValidationError } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from './http-error';

export class ValidationsError extends HttpError {
  constructor(public errors: ValidationError[], message?: string) {
    super(StatusCodes.BAD_REQUEST, message);
  }
}
