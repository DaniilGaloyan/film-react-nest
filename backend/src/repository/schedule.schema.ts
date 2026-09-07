import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ScheduleDocument {
  // Уникальный идентификатор сеанса
  @Prop({ required: true })
  id: string;

  // Дата и время начала сеанса
  @Prop({ required: true })
  daytime: string;

  // Номер зала
  @Prop({ required: true })
  hall: number;

  // Количество рядов в зале
  @Prop({ required: true })
  rows: number;

  // Количество мест в ряду
  @Prop({ required: true })
  seats: number;

  // Стоимость билета на этот сеанс
  @Prop({ required: true })
  price: number;

  // Список занятых мест
  @Prop({ type: [String], default: [] })
  taken: string[];
}

export const ScheduleSchema = SchemaFactory.createForClass(ScheduleDocument);
