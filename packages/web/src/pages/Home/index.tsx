import React from 'react';
import { Redirect } from 'wouter';

import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';

export function Home() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <div>
      <p>Home</p>
    </div>
  );
}
