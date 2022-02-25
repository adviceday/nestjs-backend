import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { compare } from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { Settings } from '../../settings/entities/settings.entity';
import { Rate } from '../../rate/entities/rate.entity';
import { Category } from '../../category/entities/category.entity';
import { Advice } from '../../advice/entities/advice.entity';

/**
 * Auth methods for
 * @link User.authMethod
 */
export type authMethod = 'local';

/**
 * User entity
 */
@Entity()
export class User extends BaseEntity {
  /**
   * user id
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * method of authentication
   * For example: local;google;facebook
   * @link authMethod
   */
  @Column()
  authMethod: authMethod;

  /**
   * User email, should be unique
   */
  @Column({ unique: true })
  email: string;

  /**
   * User password, but stored in hashed form
   */
  @Column()
  hashedPassword: string;

  /**
   * Hash of refresh token
   * If null user is logged out
   */
  @Column({ nullable: true })
  hashedRefreshToken?: string;

  /**
   * All categories that user subscribed
   */
  @ManyToMany(() => Category, (category) => category.subscribers)
  @JoinTable({ name: 'user_subscribed_categories' })
  subscribedCategories: Category[];

  /**
   * User settings relation
   * @link Settings
   */
  @OneToOne(() => Settings, (settings) => settings.id, {
    cascade: true,
  })
  @JoinColumn()
  settings: Settings;

  /**
   * ID of settings relation
   */
  @RelationId((user: User) => user.settings)
  settingsId: string;

  /**
   * The rate of user
   */
  @ManyToOne(() => Rate, (rate) => rate.id)
  @JoinColumn()
  rate: Rate;

  /**
   * ID of rate relation
   */
  @RelationId((user: User) => user.rate)
  rateId: string;

  @ManyToMany(() => Advice, (advice) => advice.inUsersFavorites)
  @JoinTable({ name: 'user_favorite_advices' })
  favoriteAdvices: Advice[];
  /**
   * All advices that have been read by user
   */
  @ManyToMany(() => Advice, (advice) => advice.id)
  @JoinTable({ name: 'user_advice_history' })
  adviceHistory: Advice[];

  /**
   * Advices that generates for user
   */
  @ManyToMany(() => Advice, (advice) => advice.id)
  @JoinTable({ name: 'advice_compilation' })
  adviceCompilation: Advice[];

  /**
   * compare password with its hash stored in user record
   *
   * @param password - user decoded password
   */
  public validatePassword(password): Promise<boolean> {
    return compare(password, this.hashedPassword);
  }

  /**
   * compare refreshToken with its hash stored in user record
   *
   * @param refreshToken - user decoded token
   */
  public validateRefreshToken(refreshToken: string): Promise<boolean> {
    if (!this.hashedRefreshToken) {
      throw new UnauthorizedException('User is logged out');
    }

    return compare(refreshToken, this.hashedRefreshToken);
  }

  /**
   * Removes all fields
   * that unused for client
   */
  public publicView(): void {
    this.hashedPassword = undefined;
    this.hashedRefreshToken = undefined;
  }

  /**
   * Add object to "many to many" field
   * @param property - column name
   * @param object - object itself
   */
  public addManyToMany(property: string, object: object): Promise<User> {
    if (!this[property]) {
      this[property] = [object];
    } else {
      this[property].push(object);
    }

    return this.save();
  }

  /**
   * Remove object from "many to many" field
   * @param property - column name
   * @param objectId - id of object to delete
   */
  public removeManyToMany(property: string, objectId: string): Promise<User> {
    const objectIndex = this[property].findIndex((obj) => obj.id === objectId);
    this[property].splice(objectIndex, 1);

    return this.save();
  }
}
