import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type settingsLang = 'en' | 'ru';

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
  lang: settingsLang;
}
