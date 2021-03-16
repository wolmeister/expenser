import React from 'react';

import { AuthProvider } from './hooks/useAuth';
import { Routes } from './routes/Routes';

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
