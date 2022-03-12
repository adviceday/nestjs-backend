import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { lang } from '../../lang/types/lang.type';
import { User } from '../../user/entities/user.entity';
import { Advice } from '../../advice/entities/advice.entity';

/**
 * Category entity
 */
@Entity()
export class Category extends BaseEntity {
  /**
   * ID of category
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Name of category
   */
  @Column({ type: 'jsonb' })
  name: Record<lang, string> | string;

  /**
   *  Show nest depth
   */
  @Column()
  level: number;

  /**
   * All users that subscribe to this category
   */
  @ManyToMany(() => User, (user) => user.subscribedCategories)
  subscribers: User[];

  /**
   * All advices that are in the category
   */
  @ManyToMany(() => Advice, (advice) => advice.categories)
  advices: Advice[];

  /**
   * Stores id of parent category
   */
  @Column({ nullable: true })
  parentId?: string;

  /**
   * True means that category
   * has no parent category
   */
  get isParent(): boolean {
    return this.level === 1;
  }
}
