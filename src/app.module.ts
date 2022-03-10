import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormFactory } from './config/typeorm.factory';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SettingsModule } from './settings/settings.module';
import { RateModule } from './rate/rate.module';
import { AppController } from './app.controller';
import { CategoryModule } from './category/category.module';
import { LangModule } from './lang/lang.module';
import { AdviceModule } from './advice/advice.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DefaultAdminModule } from 'nestjs-admin';
import { typeormConfig } from './config/db.config';

@Module({
  imports: [
    DefaultAdminModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      load: [typeormConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeormFactory,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    SettingsModule,
    RateModule,
    CategoryModule,
    LangModule,
    AdviceModule,
    NotificationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
