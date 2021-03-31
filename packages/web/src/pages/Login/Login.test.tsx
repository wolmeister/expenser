import React, { FC } from 'react';
import { fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Switch } from 'wouter';

import { render } from '../../../test/utils';
import { Route } from '../../routes/Route';
import { Login } from './index';

// Setup MSW
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  localStorage.clear();
});

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
    it('should redirect to home', async () => {
      server.use(
        rest.post('/api/auth', (req, res, ctx) =>
          res(ctx.json({ user: { name: 'foo', email: 'foo' }, token: 'token' }))
        )
      );
      render(<Login />, { wrapper: Wrapper });

      fireEvent.input(screen.getByTestId('email-input'), { target: { value: 'test@email.com' } });
      fireEvent.input(screen.getByTestId('password-input'), { target: { value: '123' } });
      fireEvent.submit(screen.getByTestId('submit-button'));

      await waitForElementToBeRemoved(() => screen.queryByTestId('submit-button'));

      expect(window.location.pathname).toBe('/');
    });
  });

  describe('when the user enters invalid credentials', () => {
    it('should show an error', async () => {
      server.use(rest.post('/api/auth', (req, res, ctx) => res(ctx.status(400))));
      render(<Login />, { wrapper: Wrapper });

      fireEvent.input(screen.getByTestId('email-input'), { target: { value: 'test@email.com' } });
      fireEvent.input(screen.getByTestId('password-input'), { target: { value: '123' } });
      fireEvent.submit(screen.getByTestId('submit-button'));

      await waitFor(() => screen.getByTestId('error-message'));

      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'The email address or password is incorrect.'
      );
    });
  });

  describe('when the user clicks on the signup button', () => {
    it('should redirect to the signup page', () => {
      render(<Login />, { wrapper: Wrapper });

      fireEvent.click(screen.getByTestId('signup-button'));

      expect(window.location.pathname).toBe('/signup');
    });
  });
});
