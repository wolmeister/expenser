import React from 'react';
import { Redirect } from 'wouter';

import { useAppContext } from '../../contexts/AppContext';

export function Login() {
  const { currentUser } = useAppContext();

  if (currentUser) {
    return <Redirect href="/" />;
  }

  return (
    <div>
      <p>Login</p>
    </div>
  );
}
