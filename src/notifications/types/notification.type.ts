/**
 * Notification for user
 */
export interface Notification {
  /**
   * Type of notification
   */
  type: 'advices-generated';
  /**
   * Data of this notification
   */
  data: object;
}
