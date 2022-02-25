/**
 * The payload that stored in
 * access and refresh token
 */
export interface JwtPayload {
  /**
   * user id
   */
  sub: string;

  /**
   * user email
   */
  email: string;

  /**
   * timestamp of token creation
   */
  iat: number;

  /**
   * timestamp of token expiration
   */
  exp: number;
}
