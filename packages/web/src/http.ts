type HttpOptions = {
  body?: unknown;
  method?: string;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  token?: string | null;
};

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has('Accept')) {
    headers.append('Accept', 'application/json');
  }
  if (!headers.has('Content-Type')) {
    headers.append('Content-Type', 'application/json');
  }
  if (!headers.has('Authorization') && options.token) {
    headers.append('Authorization', `Bearer ${options.token}`);
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
