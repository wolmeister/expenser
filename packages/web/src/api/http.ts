import ky from 'ky';

let authToken: string | null = null;

function setAuthToken(token: string | null) {
  authToken = token;
}

const http = ky.extend({
  hooks: {
    beforeRequest: [
      request => {
        if (authToken) {
          request.headers.set('Authorization', `Bearer ${authToken}`);
        }
      },
    ],
  },
});

export { http, setAuthToken };
