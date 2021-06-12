import { readFileSync } from 'fs';

type AppEnvironment = {
  PORT?: string;
  DB_PORT?: string;
  DB_HOST: string;
  DB_DATABASE: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_MIN_POOL?: string;
  DB_MAX_POOL?: string;
  JWT_SECRET?: string;
  DEBUG?: string;
  NODE_ENV: 'development' | 'production';
};

const cachedSecrets: Record<string, string | undefined> = {};

export function getEnv<K extends keyof AppEnvironment>(key: K): AppEnvironment[K] {
  let value = process.env[key] || cachedSecrets[key];

  if (!value) {
    const secretFilePath = process.env[`${key}_FILE`];
    if (secretFilePath) {
      value = readFileSync(secretFilePath).toString();
      cachedSecrets[key] = value;
    }
  }

  return value as AppEnvironment[K];
}
