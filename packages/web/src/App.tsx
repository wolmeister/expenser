import React from 'react';
import { CssBaseline, GeistProvider } from '@geist-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AuthProvider } from './hooks/useAuth';
import { Routes } from './routes/Routes';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GeistProvider>
          <CssBaseline />
          <Routes />
        </GeistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
