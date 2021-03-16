import React from 'react';
import { Redirect } from 'wouter';

import { useAuth } from '../../hooks/useAuth';

export function SignUp() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <div>
      <p>SignUp</p>
    </div>
  );
}
