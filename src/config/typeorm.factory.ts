import { ConfigService } from '@nestjs/config';
import { Env } from './env.interface';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

export const typeormFactory = (
  config: ConfigService<Env>,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  username: config.get('POSTGRES_USER'),
  password: config.get('POSTGRES_PASSWORD'),
  database: config.get('POSTGRES_DB'),
  port: config.get('POSTGRES_PORT'),
  host: config.get('POSTGRES_HOST'),
  synchronize: true,
  entities: [__dirname + '/../**/*.entity.js'],
});
