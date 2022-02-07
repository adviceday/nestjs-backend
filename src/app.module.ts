import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormFactory } from './config/typeorm.factory';
import { AdminModule } from '@adminjs/nestjs';

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
    AdminModule.createAdmin({
      adminJsOptions: {
        rootPath: '/admin',
        resources: [],
      },
      auth: {
        authenticate(email, password) {
          if (email === 'root@admin.com' && password === 'sodlfjk') {
            return Promise.resolve({ email, password });
          }
        },
        cookieName: 'adviceday-admin',
        cookiePassword: 'sdlkfjl',
      },
    }),
  ],
})
export class AppModule {}
