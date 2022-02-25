/**
 * The response type that uses commonly in
 * @link AuthController
 */
export interface TokensResponse {
  /**
   * basic access token with short live
   */
  token: string;

  /**
   * Long live refresh token for updating both tokens
   */
  refreshToken: string;
}
