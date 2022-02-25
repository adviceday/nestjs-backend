import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { lang } from '../../lang/types/lang.type';

/**
 * User settings
 */
@Entity()
export class Settings extends BaseEntity {
  /**
   * ID of settings
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Lang of corresponding user
   */
  @Column()
  lang: lang;
}
