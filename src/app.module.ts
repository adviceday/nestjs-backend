import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormFactory } from './config/typeorm.factory';
import { AdminModule } from '@adminjs/nestjs';
import { adminjsFactory } from './config/adminjs.factory';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SettingsModule } from './settings/settings.module';
import { RateModule } from './rate/rate.module';
import { AppController } from './app.controller';
import { CategoryModule } from './category/category.module';
import { LangModule } from './lang/lang.module';
import { AdviceModule } from './advice/advice.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeormFactory,
    }),
    AdminModule.createAdminAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: adminjsFactory,
    }),
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
