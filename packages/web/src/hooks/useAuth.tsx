import React, { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { http } from '../http';
import { setJwt } from '../jwt';

import { AuthRequest, AuthResponse } from '../models/auth';
import { User } from '../models/user';

type AuthContextData = {
  user: User | null;
  signIn(authRequest: AuthRequest): Promise<void>;
  signOut(): void;
};

const LOCAL_STORAGE_USER_KEY = '@Expenser/user';

const AuthContext = createContext<AuthContextData>({
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async signIn() {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signOut() {},
});

function AuthProvider({ children }: PropsWithChildren<unknown>) {
  const queryClient = useQueryClient();
  const { mutateAsync: authenticateAsync } = useMutation((authRequest: AuthRequest) =>
    http<AuthResponse>('/auth', { body: authRequest })
  );

  const [user, setUser] = useState<User | null>(() => {
    // TODO: Get user from api (/api/users/me)
    const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  });

  const signIn = useCallback(
    async (authRequest: AuthRequest) => {
      const result = await authenticateAsync(authRequest);
      setJwt(result.token);
      setUser(result.user);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(result.user));
    },
    [authenticateAsync]
  );

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    queryClient.clear();
  }, [queryClient]);

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
