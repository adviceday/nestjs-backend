import { ConfigService } from '@nestjs/config';
import { Env } from './env.type';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

/**
 * configure orm to connect to postgres
 *
 * @param config - to get variables from .env file
 */
export const typeormFactory = (
  config: ConfigService<Env & { typeormConfig: TypeOrmModuleOptions }>,
): TypeOrmModuleOptions => {
  return config.get('typeormConfig');
};
