import { Module } from '@nestjs/common';
import { TranslateInterceptor } from './interseptors/translate.interceptor';

@Module({
  providers: [TranslateInterceptor],
  exports: [TranslateInterceptor],
})
export class LangModule {}
