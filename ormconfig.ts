import { ConfigModule } from '@nestjs/config';
import { typeormConfig } from './src/config/db.config';

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [`.env.${process.env.NODE_ENV}`],
  load: [typeormConfig],
});
export default typeormConfig();
