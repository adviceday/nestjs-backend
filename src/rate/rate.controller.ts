import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RateService } from './services/rate.service';
import { Rate } from './entities/rate.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../user/decorators/get-user.decorator';
import { UserService } from '../user/services/user.service';

/**
 * @ignore
 */
@Controller('rate')
@UseGuards(AuthGuard('jwt-access'))
export class RateController {
  constructor(
    private rateService: RateService,
    private userService: UserService,
  ) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  public getAll(): Promise<Rate[]> {
    return this.rateService.getAll();
  }

  @Get('/current')
  @HttpCode(HttpStatus.OK)
  public async getUserRate(@GetUser('sub') userId: string): Promise<Rate> {
    const user = await this.userService.findOne({ id: userId });
    return this.rateService.findOne({ id: user.rateId });
  }

  @Get('/test-rate-guard')
  public testGuard(): string {
    return 'super';
  }
}
