import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

/**
 * Rate for user
 */
@Entity()
export class Rate extends BaseEntity {
  /**
   * ID of rate
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Name of plan
   */
  @Column()
  name: string;

  /**
   * Column to identify rate that
   * need attach to new users
   */
  @Column()
  isDefault: boolean;

  /**
   * Max count of categories
   * that user can subscribe
   */
  @Column()
  maxCategories: number;

  /**
   * tell how much advice user can get each day
   */
  @Column()
  maxAdvicePerDay: number;

  /**
   * Price per month of this rate
   * in dollars
   */
  @Column()
  pricePerMonthUSD: number;

  /**
   * Short description for rate
   */
  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.rate)
  users: User[];
}
