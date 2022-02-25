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
import { Translate } from '../lang/decorators/translate.decorator';

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
  @Translate('array', ['name', 'description'])
  @HttpCode(HttpStatus.OK)
  public getAll(): Promise<Rate[]> {
    return this.rateService.getAll();
  }

  @Get('/current')
  @Translate('object', ['name', 'description'])
  @HttpCode(HttpStatus.OK)
  public async getUserRate(@GetUser('sub') userId: string): Promise<Rate> {
    const user = await this.userService.findOne({ id: userId });
    return this.rateService.findOne({ id: user.rateId });
  }
}
