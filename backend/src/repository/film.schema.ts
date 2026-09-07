import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ScheduleDocument, ScheduleSchema } from './schedule.schema';

@Schema({ collection: 'films', timestamps: true })
export class FilmDocument {
  // Уникальный идентификатор фильма
  @Prop({ required: true, index: true })
  id: string;

  // Рейтинг фильма
  @Prop({ required: true })
  rating: number;

  // Режиссёр фильма
  @Prop({ required: true })
  director: string;

  // Теги фильма
  @Prop({ required: true, type: [String] })
  tags: string[];

  // Путь к изображению-превью фильма
  @Prop({ required: true })
  image: string;

  // Путь к обложке фильма
  @Prop({ required: true })
  cover: string;

  // Название фильма
  @Prop({ required: true })
  title: string;

  // Краткое описание фильма
  @Prop({ required: true })
  about: string;

  // Полное описание фильма
  @Prop({ required: true })
  description: string;

  // Массив сеансов
  @Prop({ type: [ScheduleSchema], default: [] })
  schedule: ScheduleDocument[];
}

export const FilmSchema = SchemaFactory.createForClass(FilmDocument);
