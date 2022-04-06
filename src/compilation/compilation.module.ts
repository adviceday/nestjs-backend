import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompilationRepository } from './repositories/compilation.repository';
import { UserModule } from '../user/user.module';
import { CompilationController } from './compilation.controller';
import { CompilationService } from './services/compilation.service';
import { CompilationGeneratorService } from './services/compilation-generator.service';
import { CategoryModule } from '../category/category.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AdviceModule } from '../advice/advice.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompilationRepository]),
    UserModule,
    CategoryModule,
    NotificationsModule,
    AdviceModule,
  ],
  providers: [CompilationService, CompilationGeneratorService],
  controllers: [CompilationController],
})
export class CompilationModule {}
