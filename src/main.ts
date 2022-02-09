import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Database, Resource } from '@adminjs/typeorm';
import AdminJS from 'adminjs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  AdminJS.registerAdapter({ Database, Resource });
  const app = await NestFactory.create(AppModule);

  // set globals
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}

bootstrap();
