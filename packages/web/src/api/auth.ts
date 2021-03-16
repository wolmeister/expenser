import { AuthRequest, AuthResponse } from '../models/auth';
import { http } from './http';

export async function authenticate(authRequest: AuthRequest): Promise<AuthResponse> {
  return http
    .post('/api/auth', {
      json: authRequest,
    })
    .json();
}
