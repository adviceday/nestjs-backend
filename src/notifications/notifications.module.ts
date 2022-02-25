import { Client } from 'onesignal-node';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from './services/notifications.service';
import { onesignalFactory } from '../config/onesignal.factory';

@Module({
  providers: [
    NotificationsService,
    {
      provide: Client,
      inject: [ConfigService],
      useFactory: onesignalFactory,
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
