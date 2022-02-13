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
  ],
})
export class AppModule {}
