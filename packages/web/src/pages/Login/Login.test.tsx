import React, { FC } from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { Switch } from 'wouter';

import { render, server } from '../../../test/utils';
import { Route } from '../../routes/Route';
import { Login } from './index';

const Wrapper: FC = ({ children }) => (
  <Switch>
    <Route path="/login" isAuthPage>
      {children}
    </Route>
    <Route path="/" isPrivate>
      Home
    </Route>
  </Switch>
);

describe('Login', () => {
  describe('when the user enters valid credentials', () => {
    it('should login and redirect to home', async () => {
      server.use(
        rest.post('/api/auth', (req, res, ctx) =>
          res(ctx.json({ user: { name: 'foo', email: 'foo' }, token: 'token' }))
        )
      );
      render(<Login />, { wrapper: Wrapper });

      userEvent.type(screen.getByTestId('email-input'), 'test@email.com');
      userEvent.type(screen.getByTestId('password-input'), '123');
      userEvent.click(screen.getByTestId('submit-button'));

      await waitForElementToBeRemoved(() => screen.queryByTestId('submit-button'));

      expect(window.location.pathname).toBe('/');
    });
  });

  describe('when the user enters invalid credentials', () => {
    it('should show an error', async () => {
      server.use(rest.post('/api/auth', (req, res, ctx) => res(ctx.status(400))));
      render(<Login />, { wrapper: Wrapper });

      userEvent.type(screen.getByTestId('email-input'), 'test@email.com');
      userEvent.type(screen.getByTestId('password-input'), '123');
      userEvent.click(screen.getByTestId('submit-button'));

      expect(await screen.findByTestId('error-message')).toHaveTextContent(
        'The email address or password is incorrect.'
      );
    });
  });

  describe('when the user enters no credentials', () => {
    it('should show an error in the required fields', async () => {
      render(<Login />, { wrapper: Wrapper });

      userEvent.click(screen.getByTestId('submit-button'));

      expect(await screen.findByTestId('email-message')).toHaveTextContent('Field is required');
      expect(screen.getByTestId('password-message')).toHaveTextContent('Field is required');
    });
  });

  describe('when the user clicks on the signup button', () => {
    it('should redirect to the signup page', () => {
      render(<Login />, { wrapper: Wrapper });

      userEvent.click(screen.getByTestId('signup-button'));

      expect(window.location.pathname).toBe('/signup');
    });
  });
});
