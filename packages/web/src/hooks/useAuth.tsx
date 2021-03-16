import React, { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';

import { AuthRequest, AuthResponse } from '../models/auth';
import { User } from '../models/user';
import { useHttp } from './useHttp';

type AuthContextData = {
  user: User | null;
  token: string | null;
  signIn(authRequest: AuthRequest): Promise<void>;
  signOut(): void;
};

const LOCAL_STORAGE_TOKEN_KEY = '@Expenser/jwt';
const LOCAL_STORAGE_USER_KEY = '@Expenser/user';

const AuthContext = createContext<AuthContextData>({
  user: null,
  token: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async signIn() {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signOut() {},
});

function AuthProvider({ children }: PropsWithChildren<unknown>) {
  const http = useHttp();

  const [user, setUser] = useState<User | null>(() => {
    // TODO: Get user from api (/api/users/me)
    const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY));

  const signIn = useCallback(
    async (authRequest: AuthRequest) => {
      const result = await http
        .post('/api/auth', {
          json: authRequest,
        })
        .json<AuthResponse>();
      setToken(result.token);
      setUser(result.user);
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, result.token);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(result.user));
    },
    [http]
  );

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
