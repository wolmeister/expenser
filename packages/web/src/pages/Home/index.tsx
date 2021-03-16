import React from 'react';
import { Redirect } from 'wouter';

import { useAppContext } from '../../contexts/AppContext';

export function Home() {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <Redirect href="/login" />;
  }

  return (
    <div>
      <p>Home</p>
    </div>
  );
}
