import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Tree } from '../../types/tree.type';

/**
 * Category repository
 */
@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  /**
   * @ignore
   */
  constructor() {
    super();
  }

  /**
   * recursive function
   * building tree of category with categoryId
   *
   * @param categoryId - id or category
   * @param depth - depth of  tree
   * @private
   */
  public async buildTree(
    categoryId: string,
    depth = 999,
  ): Promise<Tree<Category>> {
    const currentNode = await this.findOne({
      id: categoryId,
    });

    if (1 >= depth || !currentNode) {
      return {
        node: currentNode,
        children: [],
      };
    }

    const children = await this.find({
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
}
