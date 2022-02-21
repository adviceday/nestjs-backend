import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { lang } from '../../lang/types/lang.type';
import { Advice } from './advice.entity';

/**
 * Author entity
 */
@Entity()
export class AdviceAuthor extends BaseEntity {
  /**
   * ID of author
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Author name multiple langs
   */
  @Column({ type: 'jsonb' })
  name: Record<lang, string> | string;

  /**
   * Author advices
   */
  @OneToMany(() => Advice, (advice) => advice.author)
  advices: Advice[];
}
