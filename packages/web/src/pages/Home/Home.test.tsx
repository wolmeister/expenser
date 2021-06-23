import React, { FC } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from 'wouter';

import { render } from '../../../test/utils';
import { Route } from '../../routes/Route';
import { setJwt } from '../../jwt';
import { Home } from './index';

const Wrapper: FC = ({ children }) => (
  <Switch>
    <Route path="/login" isAuthPage>
      Login
    </Route>
    <Route path="/" isPrivate>
      {children}
    </Route>
  </Switch>
);

describe('Home', () => {
  beforeEach(() => {
    setJwt('token');
    // Temporary, remove after implementing the new user loading
    localStorage.setItem(
      '@Expenser/user',
      JSON.stringify({ name: 'name', email: 'test@email.com' })
    );
  });

  describe('when the user clicks on the logout button', () => {
    it('should logout and redirect to login', async () => {
      render(<Home />, { wrapper: Wrapper });

      userEvent.click(screen.getByTestId('logout-button'));

      expect(window.location.pathname).toBe('/login');
    });
  });
});
