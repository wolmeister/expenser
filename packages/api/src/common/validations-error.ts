import { ValidationError } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from './http-error';

export class ValidationsError extends HttpError {
  public errors: ValidationError[];

  constructor(errors: ValidationError[] | ValidationError, message?: string) {
    super(StatusCodes.BAD_REQUEST, message);
    this.errors = Array.isArray(errors) ? errors : [errors];
  }
}
