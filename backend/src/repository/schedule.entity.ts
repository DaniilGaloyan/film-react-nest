import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Film } from './film.entity';
import { TextArrayTransformer } from './text-array.transform';

@Entity('schedules')
export class Schedule {
  // Уникальный идентификатор сеанса
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Дата и время начала сеанса
  @Column()
  daytime: string;

  // Номер зала
  @Column('integer')
  hall: number;

  // Количество рядов в зале
  @Column('integer')
  rows: number;

  // Количество мест в ряду
  @Column('integer')
  seats: number;

  // Стоимость билета на этот сеанс
  @Column('double precision')
  price: number;

  // Занятые места вида «ряд:место»
  @Column({ type: 'text', transformer: TextArrayTransformer })
  taken: string[];

  // Внешний ключ на фильм
  @Column({ name: 'filmId', type: 'uuid', nullable: true })
  filmId: string | null;

  // Фильм, к которому относится сеанс
  @ManyToOne(() => Film, (film) => film.schedules)
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
