import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { lang } from '../../lang/types/lang.type';
import { AdviceAuthor } from './advice-author.entity';
import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/entities/user.entity';

/**
 * Advice entity
 */
@Entity()
export class Advice extends BaseEntity {
  /**
   * id of advice
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Date of creation
   */
  @CreateDateColumn()
  createdAt: string;

  /**
   * Date of update
   */
  @UpdateDateColumn()
  updatedAt: string;

  /**
   * text of advice
   */
  @Column({ type: 'jsonb' })
  text: Record<lang, string> | string;

  /**
   * Link to the origin resource
   */
  @Column()
  originLink: string;

  /**
   * All categories that advice includes
   */
  @ManyToMany(() => Category, (category) => category.advices)
  @JoinTable({ name: 'advices_categories' })
  categories: Category[];

  /**
   * Author of the advice
   */
  @ManyToOne(() => AdviceAuthor, (author) => author.id)
  @JoinColumn()
  author: AdviceAuthor;

  /**
   * ID of author relation
   */
  @RelationId((advice: Advice) => advice.author)
  authorId: string;

  /**
   * Users that stared this advice
   */
  @ManyToMany(() => User, (user) => user.favoriteAdvices)
  inUsersFavorites: User[];
}
