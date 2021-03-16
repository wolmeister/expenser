import { User } from '../models/user';
import { http } from './http';

export async function getAuthenticatedUser(): Promise<User> {
  return http.get('/api/users/me').json();
}
