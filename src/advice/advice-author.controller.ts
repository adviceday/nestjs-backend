import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AdviceAuthorService } from './services/advice-author.service';
import { AuthGuard } from '@nestjs/passport';
import { AdviceAuthor } from './entities/advice-author.entity';
import { Translate } from '../lang/decorators/translate.decorator';

/**
 * @ignore
 */
@Controller('advice-author')
@UseGuards(AuthGuard('jwt-access'))
export class AdviceAuthorController {
  constructor(private readonly authorService: AdviceAuthorService) {}

  @Get('/all')
  @Translate('array', ['name'])
  public getAllAuthors(): Promise<AdviceAuthor[]> {
    return this.authorService.getAll();
  }

  @Get('/:id')
  @Translate('object', ['name'])
  public getAuthor(
    @Param('id', ParseUUIDPipe) authorId: string,
  ): Promise<AdviceAuthor> {
    return this.authorService.findOne({ id: authorId });
  }
}
