import ky from 'ky';

import { getAuthenticationToken } from './authService';

export const http = ky.extend({
  hooks: {
    beforeRequest: [
      request => {
        const token = getAuthenticationToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
  },
});
