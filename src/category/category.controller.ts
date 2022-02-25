import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { AuthGuard } from '@nestjs/passport';
import { Category } from './entities/category.entity';
import { Translate } from '../lang/decorators/translate.decorator';
import { Tree } from '../types/tree.type';
import { GetUser } from '../user/decorators/get-user.decorator';

/**
 * @ignore
 */
@Controller('category')
@UseGuards(AuthGuard('jwt-access'))
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/all-tops')
  @Translate('array', ['name'])
  @HttpCode(HttpStatus.OK)
  public getAllTops(): Promise<Category[]> {
    return this.categoryService.topCategories();
  }

  @Get('/subscribed')
  @Translate('array', ['name'])
  @HttpCode(HttpStatus.OK)
  public subscribedCategories(
    @GetUser('sub') userId: string,
  ): Promise<Category[]> {
    return this.categoryService.subscribedCategories(userId);
  }

  @Get('/:id')
  @Translate('tree', ['name'])
  @HttpCode(HttpStatus.OK)
  public getTree(
    @Param('id', ParseUUIDPipe) categoryId: string,
    @Query('depth', new DefaultValuePipe(999), ParseIntPipe) depth: number,
  ): Promise<Tree<Category>> {
    return this.categoryService.categoryTree(categoryId, depth);
  }

  @Post('/:id/subscribe')
  @Translate('object', ['name'])
  @HttpCode(HttpStatus.OK)
  public subscribe(
    @GetUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) categoryId: string,
  ): Promise<Category> {
    return this.categoryService.subscribe(userId, categoryId);
  }

  @Post('/:id/unsubscribe')
  @Translate('object', ['name'])
  @HttpCode(HttpStatus.OK)
  public unsubscribe(
    @GetUser('sub') userId: string,
    @Param('id', ParseUUIDPipe) categoryId: string,
  ): Promise<Category> {
    return this.categoryService.unsubscribe(userId, categoryId);
  }
}
