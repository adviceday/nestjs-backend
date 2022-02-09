import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { compare } from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

export type authMethod = 'local';

@Entity()
/**
 * User entity
 */
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  authMethod: authMethod;

  @Column({ unique: true })
  email: string;

  @Column()
  hashedPassword: string;

  @Column({ nullable: true })
  hashedRefreshToken?: string;

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
