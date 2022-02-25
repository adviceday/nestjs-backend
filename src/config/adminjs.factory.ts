import { ConfigService } from '@nestjs/config';
import { Env } from './env.type';
import { User } from '../user/entities/user.entity';
import { Settings } from '../settings/entities/settings.entity';
import { Rate } from '../rate/entities/rate.entity';
import { Category } from '../category/entities/category.entity';
import { AdminModuleOptions } from '@adminjs/nestjs';
import { Advice } from '../advice/entities/advice.entity';
import { AdviceAuthor } from '../advice/entities/advice-author.entity';

/**
 * The list of resources and their options
 */
const resources: any[] = [
  { resource: User, options: { listProperties: ['authMethod', 'email'] } },
  { resource: Settings, options: { listProperties: ['lang'] } },
  {
    resource: Rate,
    options: {
      listProperties: [
        'name',
        'isDefault',
        'maxCategories',
        'maxAdvicePerDay',
        'pricePerMonthUSD',
      ],
    },
  },
  {
    resource: Category,
    options: {
      sort: {
        sortBy: 'id',
        direction: 'asc',
      },
      properties: { name: { type: 'textarea' } },
      listProperties: ['name', 'parentId'],
    },
  },
  {
    resource: Advice,
    options: {
      properties: { text: { type: 'textarea' } },
      listProperties: ['text', 'originLink'],
    },
  },
  {
    resource: AdviceAuthor,
    options: { properties: { name: { type: 'textarea' } } },
  },
];

/**
 * configure admin panel
 * inject in app module
 *
 * @link AuthModule
 * @param config - to get variables from .env file
 */
export const adminjsFactory = (
  config: ConfigService<Env>,
): AdminModuleOptions => ({
  adminJsOptions: {
    rootPath: '/admin',
    resources,
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
