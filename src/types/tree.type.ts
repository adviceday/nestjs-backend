/**
 * Type for trees *(recursive)
 */
export interface Tree<T> {
  /**
   * object of tree itself
   */
  node: T;

  /**
   * all children sub-trees
   */
  children: Tree<T>[];
}
