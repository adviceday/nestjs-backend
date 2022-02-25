import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
   * Category of advice
   */
  @ManyToOne(() => Category, (category) => category.id)
  @JoinColumn()
  category: Category;

  /**
   * Related category id
   */
  @RelationId((advice: Advice) => advice.category)
  categoryId: string;

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

  /**
   * All users
   */
  @ManyToMany(() => User, (user) => user.adviceCompilation)
  inUsersCompilation: User[];
}
