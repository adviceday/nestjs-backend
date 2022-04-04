import {
  Controller,
  Get,
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
import { UserService } from '../user/services/user.service';
import { AdviceGeneratorService } from './services/advice-generator.service';

/**
 * @ignore
 */
@Controller('advice')
@UseGuards(AuthGuard('jwt-access'))
export class AdviceController {
  constructor(
    private readonly adviceService: AdviceService,
    private readonly userService: UserService,
    private readonly adviceGenerator: AdviceGeneratorService,
  ) {}

  @Post('/trigger-generation')
  public triggerGeneration() {
    return this.adviceGenerator.handleCrone();
  }

  @Get('/get-compilation')
  @HttpCode(HttpStatus.OK)
  public async getCompilation(
    @GetUser('sub') userId: string,
  ): Promise<Advice[]> {
    const compilation = await this.userService.getCompilation(userId);
    await this.adviceService.clearUserCompilation(userId);

    return compilation;
  }

  @Get('/favorites')
  @Translate('array', ['text'])
  @HttpCode(HttpStatus.OK)
  public getFavorites(@GetUser('sub') userId: string): Promise<Advice[]> {
    return this.adviceService.getFavorites(userId);
  }

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

  @Get('/history')
  @Translate('array', ['text'])
  @HttpCode(HttpStatus.OK)
  public getHistory(@GetUser('sub') userId: string): Promise<Advice[]> {
    return this.userService.adviceHistory(userId);
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
