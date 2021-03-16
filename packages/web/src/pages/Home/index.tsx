import React from 'react';
import { Redirect } from 'wouter';

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
