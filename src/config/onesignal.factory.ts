import { ConfigService } from '@nestjs/config';
import { Env } from './env.type';
import { Client } from 'onesignal-node';

/**
 * Returns a value of onesignal client itself
 *
 * @link NotificationsModule
 * @param config - to get variables from .env file
 */
export const onesignalFactory = (config: ConfigService<Env>) =>
  new Client(config.get('ONESIGNAL_APP_ID'), config.get('ONESIGNAL_API_KEY'));
