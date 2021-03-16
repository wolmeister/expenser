import { AuthRequest, AuthResponse } from '../models/auth';
import { http } from './http';

const LOCAL_STORAGE_TOKEN_KEY = 'token';

export function getAuthenticationToken(): string | null {
  return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
}

export function setAuthenticationToken(token: string | null): void {
  if (token) {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
  }
}

export async function authenticate(authRequest: AuthRequest): Promise<AuthResponse> {
  return http
    .post('/api/auth', {
      json: authRequest,
    })
    .json();
}
