import React, { FC } from 'react';
import { fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Switch } from 'wouter';

import { render } from '../../../test/utils';
import { Route } from '../../routes/Route';
import { SignUp } from './index';

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

      fireEvent.input(screen.getByTestId('name-input'), {
        target: { value: 'name' },
      });
      fireEvent.input(screen.getByTestId('email-input'), {
        target: { value: 'test@email.com' },
      });
      fireEvent.input(screen.getByTestId('password-input'), {
        target: { value: '1' },
      });
      fireEvent.input(screen.getByTestId('password-confirmation-input'), {
        target: { value: '1' },
      });
      fireEvent.click(screen.getByRole('button'));

      await waitForElementToBeRemoved(() => screen.queryByRole('button'));

      expect(window.location.pathname).toBe('/');
    });
  });

  describe('when the user enters a non unique email', () => {
    it('should show an error', async () => {
      server.use(rest.post('/api/users', (req, res, ctx) => res(ctx.status(400))));
      render(<SignUp />);

      fireEvent.input(screen.getByTestId('name-input'), {
        target: { value: 'name' },
      });
      fireEvent.input(screen.getByTestId('email-input'), {
        target: { value: 'test@email.com' },
      });
      fireEvent.input(screen.getByTestId('password-input'), {
        target: { value: '1' },
      });
      fireEvent.input(screen.getByTestId('password-confirmation-input'), {
        target: { value: '1' },
      });

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => screen.getByTestId('signup-error'));

      expect(screen.getByTestId('signup-error')).toHaveTextContent(
        "There's already an account associated with that email."
      );
    });
  });

  describe('when the user enters a different password in the password confirmation', () => {
    it('should show an error in the password confirmation field', async () => {
      render(<SignUp />);

      fireEvent.input(screen.getByTestId('password-input'), {
        target: { value: '1' },
      });
      fireEvent.input(screen.getByTestId('password-confirmation-input'), {
        target: { value: '2' },
      });

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => screen.getByTestId('password-confirmation-error'));

      expect(screen.getByTestId('password-confirmation-error')).toHaveTextContent(
        'The passwords do not match'
      );
    });
  });

  describe('when the user enters no information', () => {
    it('should show an error in the required fields', async () => {
      render(<SignUp />);

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => screen.getByTestId('name-error'));

      expect(screen.getByTestId('name-error')).toHaveTextContent('Field is required');
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

      fireEvent.click(screen.getByRole('link'));

      expect(window.location.pathname).toBe('/login');
    });
  });
});
