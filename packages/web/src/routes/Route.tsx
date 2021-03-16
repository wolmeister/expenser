import React from 'react';
import { Redirect, RouteProps as WouterRouteProps, Route as WouterRoute } from 'wouter';
import { useAuth } from '../hooks/useAuth';

type RouteProps = WouterRouteProps & {
  isPrivate?: boolean;
  isAuthPage?: boolean;
};

export function Route({ isPrivate, isAuthPage, path, component, children }: RouteProps) {
  const { user } = useAuth();

  if (isPrivate && !user) {
    return <Redirect href="/login" />;
  }

  if (isAuthPage && user) {
    return <Redirect href="/" />;
  }

  return (
    <WouterRoute path={path} component={component}>
      {children}
    </WouterRoute>
  );
}
