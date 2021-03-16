import React from 'react';
import { Route, Switch } from 'wouter';

import { AppContextProvider } from './contexts/AppContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';

function App() {
  return (
    <AppContextProvider>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="/" component={Home} />
        <Route>404</Route>
      </Switch>
    </AppContextProvider>
  );
}

export default App;
