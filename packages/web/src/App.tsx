import React from 'react';
import { CssBaseline, GeistProvider, Page } from '@geist-ui/react';

import { AuthProvider } from './hooks/useAuth';
import { Routes } from './routes/Routes';

export default function App() {
  return (
    <GeistProvider>
      <AuthProvider>
        <CssBaseline />
        <Routes />
      </AuthProvider>
    </GeistProvider>
  );
}
