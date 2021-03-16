import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import express, { ErrorRequestHandler } from 'express';
import 'express-async-errors';

import { HttpError } from './common/http-error';
import { ValidationsError } from './common/validations-error';
import { router as authRouter } from './modules/auth';
import { router as userRouter } from './modules/user';
import { router as entryRouter } from './modules/entry';

const app = express();
app.use(express.json());

// Setup routes
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', entryRouter);

// Setup error handling
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ValidationsError) {
    res.status(err.statusCode).send({
      message: err.message,
      status: err.statusCode,
      errors: err.errors,
    });
  } else if (err instanceof HttpError) {
    res.status(err.statusCode).send({
      message: err.message,
      status: err.statusCode,
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

app.use(errorHandler);

export { app };
