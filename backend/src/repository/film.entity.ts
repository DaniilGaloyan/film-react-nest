import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Schedule } from './schedule.entity';
import { TextArrayTransformer } from './text-array.transform';

@Entity('films')
export class Film {
  // Уникальный идентификатор фильма
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Рейтинг фильма
  @Column('double precision')
  rating: number;

  // Режиссёр фильма
  @Column()
  director: string;

  // Теги фильма
  @Column({ type: 'text', transformer: TextArrayTransformer })
  tags: string[];

  // Путь к изображению-превью фильма
  @Column()
  image: string;

  // Путь к обложке фильма
  @Column()
  cover: string;

  // Название фильма
  @Column()
  title: string;

  // Краткое описание фильма
  @Column()
  about: string;

  // Полное описание фильма
  @Column()
  description: string;

  // Связь «фильм - сеансы»
  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedules: Schedule[];
}
