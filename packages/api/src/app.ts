import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import 'express-async-errors';

import { HttpError } from './common/http-error';
import { ValidationsError } from './common/validations-error';
import { router as authRouter } from './modules/auth';
import { router as userRouter } from './modules/user';
import { router as entryRouter } from './modules/entry';
import { getEnv } from './env';
import debug from './debug';

const app = express();
app.use(express.json());

// Allow cors only for the application domains
const corsWhitelist = ['http://expenser.com.local', 'http://expenser.wolmeister.com'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (getEnv('NODE_ENV') !== 'production') {
        callback(null, true);
        return;
      }
      if (origin && corsWhitelist.includes(origin)) {
        callback(null, true);
        return;
      }
      const errorMsg = `Origin${origin ? ` "${origin}"` : ''} not allowed by CORS`;
      callback(new HttpError(StatusCodes.FORBIDDEN, errorMsg));
    },
  })
);

// Setup routes
app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', entryRouter);

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
    debug.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

app.use(errorHandler);

export { app };
