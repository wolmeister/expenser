import React from 'react';
import { Switch } from 'wouter';

import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { SignUp } from '../pages/SignUp';
import { Route } from './Route';

export function Routes() {
  return (
    <Switch>
      <Route isAuthPage path="/login" component={Login} />
      <Route isAuthPage path="/signup" component={SignUp} />
      <Route isPrivate path="/" component={Home} />
      <Route>404</Route>
    </Switch>
  );
}
