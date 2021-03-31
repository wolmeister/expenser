import React, { FC } from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { Switch } from 'wouter';

import { render } from '../../../test/utils';
import { Route } from '../../routes/Route';
import { Home } from './index';
import { setJwt } from '../../jwt';

beforeEach(() => {
  localStorage.clear();
});

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

      fireEvent.click(screen.getByText('Logout'));

      expect(window.location.pathname).toBe('/login');
    });
  });
});
