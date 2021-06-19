import { User } from '../user';

export type AuthRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: Omit<User, 'password'>;
};
