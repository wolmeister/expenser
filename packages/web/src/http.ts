import { getJwt } from './jwt';

type HttpOptions = {
  body?: unknown;
  method?: string;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
};

// @TODO: Improve this
// The same docker image that contains the compiled html
// is used in multiple environments, which one with a distinct api url
// Search for patterns to pass variables at runtime, or diffenrent images for each env
const getApiUrl = () => {
  const { location } = window;
  // in development (localhost or an ip address) we should just redirect to /api
  if (location.hostname === 'localhost' || location.hostname.match(/^\d{1,3}\./)) {
    return '/api';
  }
  const port = location.port ? `:${location.port}` : '';
  return `${location.protocol}//api.${location.hostname}${port}${location.pathname}`;
};

const API_URL = getApiUrl();

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

  return fetch(API_URL + path, fetchOptions).then(async response => {
    if (response.ok) {
      return response.json();
    }
    const errorMessage = await response.text();
    return Promise.reject(new Error(errorMessage));
  });
}
