import { registerAs } from '@nestjs/config';
import { AdminUserEntity } from 'nestjs-admin';

/**
 * Register config for typeorm
 */
export const typeormConfig = registerAs('typeormConfig', () => ({
  type: 'postgres',
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT),
  host: process.env.POSTGRES_HOST,
  synchronize: true,
  entities: [__dirname + '/../**/*.entity.js', AdminUserEntity],
  migrations: ['src/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
}));
