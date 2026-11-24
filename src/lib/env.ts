export type AppEnv = 'development' | 'staging' | 'production';

const raw = import.meta.env.APP_ENV;

export const APP_ENV: AppEnv =
  raw === 'development' || raw === 'staging' || raw === 'production'
    ? raw
    : import.meta.env.NODE_ENV === 'production'
      ? 'production'
      : 'development';

export const isDev = APP_ENV === 'development';
export const isProd = APP_ENV === 'production';

