import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/ping')
  @HttpCode(HttpStatus.OK)
  public ping() {
    return { message: 'pong' };
  }
}
