import { Notification } from './notification.type';

/**
 * Object for emitting Notification
 */
export type notificationTransporter = {
  /**
   * Notification itself
   */
  notification: Notification;
  /**
   * User that need to get notification
   */
  forUser: string;
};
