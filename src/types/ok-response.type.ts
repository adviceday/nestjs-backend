/**
 * Response type for routes
 * that don't need to return any information
 * just get client know that operation was succeed
 */
export interface OkResponse {
  /**
   * message itself
   */
  message: 'ok';
}
