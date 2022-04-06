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
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Advice } from '../../advice/entities/advice.entity';

/**
 * Compilation of user advices
 */
@Entity('compilation')
export class Compilation extends BaseEntity {
  /**
   * ID of compilation
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Date of generation
   */
  @CreateDateColumn()
  createdAt: string;

  /**
   * Date of moment when user fetch compilation
   */
  @Column({ nullable: true, type: 'timestamp' })
  firstFetchedAt: string;

  /**
   * User for whom compilation has generated
   */
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  targetUser: User;

  /**
   * Content of compilation
   */
  @ManyToMany(() => Advice, (advice) => advice.id)
  @JoinTable({ name: 'advice_compilation' })
  advices: Advice[];
}
