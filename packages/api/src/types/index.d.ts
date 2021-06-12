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

  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      DB_HOST: string;
      DB_DATABASE: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_MIN_POOL?: string;
      DB_MAX_POOL?: string;
      JWT_SECRET?: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

export {};
