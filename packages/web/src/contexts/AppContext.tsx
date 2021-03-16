import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

import { User } from '../models/user';

type AppContextType = {
  currentUser: User | null;
  setCurrentUser(user: User | null): void;
};

export const AppContext = createContext<AppContextType>({
  currentUser: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentUser: () => {},
});

export const useAppContext = () => useContext(AppContext);

export function AppContextProvider({ children }: PropsWithChildren<unknown>) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AppContext.Provider>
  );
}
