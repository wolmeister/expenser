import { ValidationError } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { dequal } from 'dequal';

import { HttpError } from './http-error';

export class ValidationsError extends HttpError {
  public errors: ValidationError[];

  constructor(errors: ValidationError[] | ValidationError, message?: string) {
    super(StatusCodes.BAD_REQUEST, message);

    const errorsArray = Array.isArray(errors) ? errors : [errors];
    const uniqueErrors = errorsArray.filter((error, index) => {
      const otherIndex = errorsArray.findIndex(e => dequal(error, e));
      return otherIndex === index;
    });

    this.errors = uniqueErrors;
  }
}
