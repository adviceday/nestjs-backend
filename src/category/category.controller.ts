import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { AuthGuard } from '@nestjs/passport';
import { Category } from './entities/category.entity';
import { Translate } from '../lang/decorators/translate.decorator';
import { Tree } from '../types/tree.type';

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

  @Get('/:id')
  @Translate('tree', ['name'])
  @HttpCode(HttpStatus.OK)
  public getTree(
    @Param('id') categoryId: string,
    @Query('depth', new DefaultValuePipe(999), ParseIntPipe) depth: number,
  ): Promise<Tree<Category>> {
    return this.categoryService.categoryTree(categoryId, depth);
  }
}
