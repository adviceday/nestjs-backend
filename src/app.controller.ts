import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

/**
 * @ignore
 */
@Controller()
export class AppController {
  @Get('/ping')
  @HttpCode(HttpStatus.OK)
  public ping() {
    return { message: 'pong' };
  }
}
