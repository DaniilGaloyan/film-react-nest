import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'orders', timestamps: true })
export class OrderDocument {
  // Уникальный идентификатор бронирования
  @Prop({ required: true })
  id: string;

  // Email пользователя
  @Prop({ required: true })
  email: string;

  // Телефон пользователя
  @Prop({ required: true })
  phone: string;

  // Идентификатор фильма
  @Prop({ required: true })
  film: string;

  // Идентификатор сеанса
  @Prop({ required: true })
  session: string;

  // Дата и время сеанса
  @Prop({ required: true })
  daytime: string;

  // Номер ряда выбранного места
  @Prop({ required: true })
  row: number;

  // Номер места в ряду
  @Prop({ required: true })
  seat: number;

  // Стоимость билета
  @Prop({ required: true })
  price: number;
}

export const OrderSchema = SchemaFactory.createForClass(OrderDocument);
