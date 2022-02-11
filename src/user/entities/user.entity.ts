import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { compare } from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { Settings } from '../../settings/entities/settings.entity';

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
}
