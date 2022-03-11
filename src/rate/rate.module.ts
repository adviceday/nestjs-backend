import { forwardRef, Module } from '@nestjs/common';
import { RateController } from './rate.controller';
import { RateService } from './services/rate.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateRepository } from './repositories/rate.repository';
import { DefaultAdminModule, DefaultAdminSite } from 'nestjs-admin';
import { RateAdmin } from './entities/rate-admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RateRepository]),
    forwardRef(() => UserModule),
    DefaultAdminModule,
  ],
  providers: [RateService],
  controllers: [RateController],
  exports: [RateService],
})
export class RateModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('User', RateAdmin);
  }
}
