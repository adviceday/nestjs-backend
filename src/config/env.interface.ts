export interface Env {
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: 'main';
  POSTGRES_PORT: number;
  POSTGRES_HOST: string;

  ADMINJS_ROOT_USER: string;
  ADMINJS_ROOT_PASSWORD: string;
  ADMINJS_COOKIE_PASSWORD: string;
}
