import React from 'react';
import { render } from '@testing-library/react';

import { Login } from './index';

test('Render login', () => {
  render(<Login />);
  expect(true).toBe(true);
});
