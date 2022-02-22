import { Controller, Sse, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationsService } from './services/notifications.service';
import { Notification } from './types/notification.type';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../user/decorators/get-user.decorator';

/**
 * @ignore
 */
@Controller('notifications')
@UseGuards(AuthGuard('jwt-access-sse'))
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Sse()
  streamNotifications(
    @GetUser('sub') userId: string,
  ): Observable<Notification> {
    return this.notificationsService.stream(userId);
  }
}
