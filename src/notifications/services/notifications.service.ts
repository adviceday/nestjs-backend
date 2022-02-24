import { Injectable } from '@nestjs/common';
import { Client } from 'onesignal-node';
import { lang } from '../../lang/types/lang.type';
import { ClientResponse } from 'onesignal-node/lib/types';

/**
 * Service for sending notifications to the users
 */
@Injectable()
export class NotificationsService {
  /**
   * Inject providers
   * @param onesignalClient - to create notification in onesignal
   */
  constructor(private readonly onesignalClient: Client) {}

  /**
   * send notification to specific user
   * @param forUser - id of onesignal user to send notification
   * @param data - messages on multiple langs
   */
  public emit(
    forUser: string,
    data: Record<lang, string>,
  ): Promise<ClientResponse> {
    return this.onesignalClient.createNotification({
      contents: data,
      include_player_ids: [forUser],
    });
  }
}
