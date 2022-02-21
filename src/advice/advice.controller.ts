import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdviceService } from './services/advice.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../user/decorators/get-user.decorator';
import { Advice } from './entities/advice.entity';
import { Translate } from '../lang/decorators/translate.decorator';

/**
 * @ignore
 */
@Controller('advice')
@UseGuards(AuthGuard('jwt-access'))
export class AdviceController {
  constructor(private readonly adviceService: AdviceService) {}

  @Post('/:id/add-fav')
  @Translate('object', ['text'])
  @HttpCode(HttpStatus.CREATED)
  public addFav(
    @GetUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) adviceId: string,
  ): Promise<Advice> {
    return this.adviceService.addToFavorites(adviceId, userId);
  }

  @Post('/:id/remove-fav')
  @Translate('object', ['text'])
  @HttpCode(HttpStatus.OK)
  public removeFav(
    @GetUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) adviceId: string,
  ): Promise<Advice> {
    return this.adviceService.removeFromFavorites(adviceId, userId);
  }

  @Post('/:id/history-add')
  @Translate('object', ['text'])
  @HttpCode(HttpStatus.OK)
  public addToHistory(
    @GetUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) adviceId: string,
  ): Promise<Advice> {
    return this.adviceService.addToHistory(adviceId, userId);
  }

  @Post('/:id/history-remove')
  @Translate('object', ['text'])
  @HttpCode(HttpStatus.OK)
  public removeFromHistory(
    @GetUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) adviceId: string,
  ): Promise<Advice> {
    return this.adviceService.removeFromHistory(adviceId, userId);
  }
}
