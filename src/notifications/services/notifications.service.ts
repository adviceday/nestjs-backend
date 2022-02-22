import { Injectable } from '@nestjs/common';
import { filter, map, Observable, Subject } from 'rxjs';
import { Notification } from '../types/notification.type';
import { notificationTransporter } from '../types/notification-transporter.type';

/**
 * Service for sending notifications to the users
 */
@Injectable()
export class NotificationsService {
  /**
   * Rxjs subject for transporting messages
   * @private
   */
  private transporter = new Subject<notificationTransporter>();

  /**
   * Stream notifications and filtering them by userid
   * @param userId - id of user that subscribe to stream
   */
  public stream(userId: string): Observable<Notification> {
    return this.transporter.asObservable().pipe(
      filter(
        (notification: notificationTransporter) =>
          notification.forUser === userId,
      ),
      map((data: notificationTransporter) => data.notification),
    );
  }

  /**
   * Emit new notification to transporter Subject
   * @param forUser - ID of user that need to get notification
   * @param notification - notification object itself
   */
  public emit(forUser: string, notification: Notification): void {
    this.transporter.next({ notification, forUser });
  }
}
