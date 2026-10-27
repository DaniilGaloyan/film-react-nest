import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('orders')
export class Order {
  // Уникальный идентификатор бронирования
  @PrimaryColumn('uuid')
  id: string;

  // Email пользователя
  @Column()
  email: string;

  // Телефон пользователя
  @Column()
  phone: string;

  // Идентификатор фильма
  @Column('uuid')
  film: string;

  // Идентификатор сеанса
  @Column('uuid')
  session: string;

  // Дата и время сеанса
  @Column()
  daytime: string;

  // Номер ряда выбранного места
  @Column('integer')
  row: number;

  // Номер места в ряду
  @Column('integer')
  seat: number;

  // Стоимость билета
  @Column('double precision')
  price: number;
}
