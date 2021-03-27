import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useMutation } from 'react-query';
import { http } from '../http';

import { AuthRequest, AuthResponse } from '../models/auth';
import { User } from '../models/user';

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
  const { mutateAsync: authenticateAsync } = useMutation((authRequest: AuthRequest) =>
    http<AuthResponse>('/api/auth', { body: authRequest })
  );

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
      const result = await authenticateAsync(authRequest);
      setUser(result.user);
      setToken(result.token);
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, result.token);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(result.user));
    },
    [authenticateAsync]
  );

  const signOut = useCallback(() => {
    setUser(null);
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
