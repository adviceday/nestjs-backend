import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type settingsLang = 'en' | 'ru';

@Entity()
export class Settings extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lang: settingsLang;
}
