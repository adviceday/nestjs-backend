/**
 * Mirror of .env.* file
 */
export interface Env {
  /**
   * app user for db
   */
  POSTGRES_USER: string;
  /**
   * password for db user
   */
  POSTGRES_PASSWORD: string;
  /**
   * Database name
   */
  POSTGRES_DB: 'main';
  /**
   * port to connect with db
   */
  POSTGRES_PORT: number;
  /**
   * host to connect with db
   */
  POSTGRES_HOST: string;

  /**
   * set user for admin dashboard
   */
  ADMINJS_ROOT_USER: string;
  /**
   * set password for admin dashboard
   */
  ADMINJS_ROOT_PASSWORD: string;
  /**
   * for browser authenticate
   */
  ADMINJS_COOKIE_PASSWORD: string;

  /**
   * for access token strategy
   * @link AccessTokenStrategy
   */
  JWT_SECRET: string;
  /**
   * for refresh token strategy
   * @link RefreshTokenStrategy
   */
  JWT_REFRESH_SECRET: string;
}
