import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { setAuthToken } from '../api/http';
import { authenticate } from '../api/auth';
import { AuthRequest } from '../models/auth';
import { User } from '../models/user';

type AuthContextData = {
  user: User | null;
  signIn(authRequest: AuthRequest): Promise<void>;
  signOut(): void;
};

const LOCAL_STORAGE_TOKEN_KEY = '@Expenser/jwt';
const LOCAL_STORAGE_USER_KEY = '@Expenser/user';

const AuthContext = createContext<AuthContextData>({
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async signIn() {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signOut() {},
});

function AuthProvider({ children }: PropsWithChildren<unknown>) {
  const [user, setUser] = useState<User | null>(() => {
    // TODO: Get user from api (/api/users/me)
    const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  });

  const signIn = useCallback(async (authRequest: AuthRequest) => {
    const result = await authenticate(authRequest);
    setUser(result.user);
    setAuthToken(result.token);
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, result.token);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(result.user));
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  }, []);

  useEffect(() => {
    setAuthToken(localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY));
  }, []);

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
