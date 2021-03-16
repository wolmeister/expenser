import React from 'react';
import { Redirect } from 'wouter';

import { useAppContext } from '../../contexts/AppContext';

export function SignUp() {
  const { currentUser } = useAppContext();

  if (currentUser) {
    return <Redirect href="/" />;
  }

  return (
    <div>
      <p>SignUp</p>
    </div>
  );
}
