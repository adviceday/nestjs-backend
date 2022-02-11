import { ConfigService } from '@nestjs/config';
import { Env } from './env.type';
import { User } from '../user/entities/user.entity';

/**
 * configure admin panel
 * inject in app module
 *
 * @link AuthModule
 * @param config - to get variables from .env file
 */
export const adminjsFactory = (config: ConfigService<Env>) => ({
  adminJsOptions: {
    rootPath: '/admin',
    resources: [User],
  },
  auth: {
    authenticate(email, password) {
      if (
        email === config.get('ADMINJS_ROOT_USER') &&
        password === config.get('ADMINJS_ROOT_PASSWORD')
      ) {
        return Promise.resolve({ email, password });
      }
    },
    cookieName: 'adviceday-admin',
    cookiePassword: config.get('ADMINJS_COOKIE_PASSWORD'),
  },
});
