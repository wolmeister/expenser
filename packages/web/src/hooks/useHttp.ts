import ky from 'ky';
import { useMemo } from 'react';
import { useAuth } from './useAuth';

function useHttp() {
  const { token } = useAuth();
  const http = useMemo(
    () =>
      ky.extend({
        hooks: {
          beforeRequest: [
            request => {
              if (token) {
                request.headers.set('Authorization', `Bearer ${token}`);
              }
            },
          ],
        },
      }),
    [token]
  );

  return http;
}

export { useHttp };
