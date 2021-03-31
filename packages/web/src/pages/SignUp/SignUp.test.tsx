import React, { FC } from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { Switch } from 'wouter';

import { render, server } from '../../../test/utils';
import { Route } from '../../routes/Route';
import { SignUp } from './index';

const Wrapper: FC = ({ children }) => (
  <Switch>
    <Route path="/signup" isAuthPage>
      {children}
    </Route>
    <Route path="/" isPrivate>
      Home
    </Route>
  </Switch>
);

describe('SignUp', () => {
  describe('when the user enters valid informations', () => {
    it('should signin and redirect to home', async () => {
      server.use(
        rest.post('/api/users', (req, res, ctx) => res(ctx.json({}))),
        rest.post('/api/auth', (req, res, ctx) =>
          res(ctx.json({ user: { name: 'name', email: 'test@email.com' }, token: 'token' }))
        )
      );
      window.history.pushState({}, 'Test page', '/signup');
      render(<SignUp />, { wrapper: Wrapper });

      userEvent.type(screen.getByTestId('name-input'), 'name');
      userEvent.type(screen.getByTestId('email-input'), 'test@email.com');
      userEvent.type(screen.getByTestId('password-input'), '1');
      userEvent.type(screen.getByTestId('password-confirmation-input'), '1');
      userEvent.click(screen.getByRole('button'));

      await waitForElementToBeRemoved(() => screen.queryByRole('button'));

      expect(window.location.pathname).toBe('/');
    });
  });

  describe('when the user enters a non unique email', () => {
    it('should show an error', async () => {
      server.use(rest.post('/api/users', (req, res, ctx) => res(ctx.status(400))));
      render(<SignUp />);

      userEvent.type(screen.getByTestId('name-input'), 'name');
      userEvent.type(screen.getByTestId('email-input'), 'test@email.com');
      userEvent.type(screen.getByTestId('password-input'), '1');
      userEvent.type(screen.getByTestId('password-confirmation-input'), '1');
      userEvent.click(screen.getByRole('button'));

      expect(await screen.findByTestId('signup-error')).toHaveTextContent(
        "There's already an account associated with that email."
      );
    });
  });

  describe('when the user enters a different password in the password confirmation', () => {
    it('should show an error in the password confirmation field', async () => {
      render(<SignUp />);

      userEvent.type(screen.getByTestId('password-input'), '1');
      userEvent.type(screen.getByTestId('password-confirmation-input'), '2');
      userEvent.click(screen.getByRole('button'));

      expect(await screen.findByTestId('password-confirmation-error')).toHaveTextContent(
        'The passwords do not match'
      );
    });
  });

  describe('when the user enters no information', () => {
    it('should show an error in the required fields', async () => {
      render(<SignUp />);

      userEvent.click(screen.getByRole('button'));

      expect(await screen.findByTestId('name-error')).toHaveTextContent('Field is required');
      expect(screen.getByTestId('email-error')).toHaveTextContent('Field is required');
      expect(screen.getByTestId('password-error')).toHaveTextContent('Field is required');
      expect(screen.getByTestId('password-confirmation-error')).toHaveTextContent(
        'Field is required'
      );
    });
  });

  describe('when the user clicks on the login button', () => {
    it('should redirect to the login page', () => {
      render(<SignUp />);

      userEvent.click(screen.getByRole('link'));

      expect(window.location.pathname).toBe('/login');
    });
  });
});
