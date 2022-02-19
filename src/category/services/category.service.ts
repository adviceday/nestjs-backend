import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '../entities/category.entity';
import { Tree } from '../../types/tree.type';

/**
 * Service to manipulate categories
 */
@Injectable()
export class CategoryService {
  /**
   * Inject providers
   *
   * @param categoryRepository - to manipulate users table
   */
  constructor(
    @InjectRepository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  /**
   * Fetch all categories that don't have parents
   */
  public topCategories(): Promise<Category[]> {
    return this.categoryRepository.find({ level: 1 });
  }

  /**
   * Check existent of root category
   * build its tree
   *
   * @param categoryId - id of root category
   * @param depth - depth of it's tree
   */
  public async categoryTree(
    categoryId: string,
    depth: number,
  ): Promise<Tree<Category>> {
    // call it to check existent
    await this.findOne({ id: categoryId });

    return this.buildTree(categoryId, depth);
  }

  /**
   * recursive function
   * building tree of category with categoryId
   *
   * @param categoryId - id or category
   * @param depth - depth of  tree
   * @private
   */
  private async buildTree(
    categoryId: string,
    depth = 999,
  ): Promise<Tree<Category>> {
    const currentNode = await this.categoryRepository.findOne({
      id: categoryId,
    });

    if (1 >= depth || !currentNode) {
      return {
        node: currentNode,
        children: [],
      };
    }

    const children = await this.categoryRepository.find({
      parentId: currentNode.id,
    });
    const childrenTrees = children.map((child) =>
      this.buildTree(child.id, depth - 1),
    );
    return {
      node: currentNode,
      children: await Promise.all(childrenTrees),
    };
  }

  /**
   * Try to find category record
   * if it's not exist throws error
   *
   * @param categoryFields - fields to search in table
   */
  public async findOne(
    categoryFields: Partial<Category>,
  ): Promise<Category | never> {
    const category = await this.categoryRepository.findOne(categoryFields);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
