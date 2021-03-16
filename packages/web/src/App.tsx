import React from 'react';
import { Route, Switch } from 'wouter';

import { AuthProvider } from './hooks/useAuth';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';

export default function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="/" component={Home} />
        <Route>404</Route>
      </Switch>
    </AuthProvider>
  );
}
