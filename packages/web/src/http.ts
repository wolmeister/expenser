import { getJwt } from './jwt';

type HttpOptions = {
  body?: unknown;
  method?: string;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
};

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has('Accept')) {
    headers.append('Accept', 'application/json');
  }
  if (!headers.has('Content-Type')) {
    headers.append('Content-Type', 'application/json');
  }
  if (!headers.has('Authorization') && getJwt()) {
    headers.append('Authorization', `Bearer ${getJwt()}`);
  }

  let { method } = options;
  if (!method) {
    method = options.body ? 'POST' : 'GET';
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  return fetch(path, fetchOptions).then(async response => {
    if (response.ok) {
      return response.json();
    }
    const errorMessage = await response.text();
    return Promise.reject(new Error(errorMessage));
  });
}
