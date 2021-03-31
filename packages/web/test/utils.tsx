/* eslint-disable import/no-extraneous-dependencies */
import 'whatwg-fetch';
import React, { FC, ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import { AuthProvider } from '../src/hooks/useAuth';

// Disable react-query logger
setLogger({
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
});

// Provider Wrapper
const Providers: FC = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

// Render with custom wrapper
const customRender = (ui: ReactElement, options?: RenderOptions) => {
  let wrapper = Providers;

  if (options?.wrapper) {
    const CustomWrapper = options.wrapper;
    wrapper = ({ children }) => (
      <Providers>
        <CustomWrapper>{children}</CustomWrapper>
      </Providers>
    );
  }

  return render(ui, { ...options, wrapper });
};

export { customRender as render };
