import { ConfigService } from '@nestjs/config';
import { Env } from './env.type';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

/**
 * configure orm to connect to postgres
 *
 * @param config - to get variables from .env file
 */
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
