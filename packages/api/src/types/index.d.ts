import { User } from '../modules/user';

declare global {
  namespace Express {
    interface Request {
      /**
       * Gets the user that made this request.
       *
       * Only available when the request is authenticated.
       */
      getUser(): Promise<User>;
    }
  }
}

export {};
