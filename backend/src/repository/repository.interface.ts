import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { FilmDocument } from './film.schema';
import { OrderDocument } from './order.schema';

export const REPOSITORY_TOKEN = 'IRepository';

export interface IRepository {
  // Возвращает все фильмы
  findAll(): Promise<FilmDto[]>;

  // Возвращает фильм и его расписание
  findOne(filmId: string): Promise<{ film: FilmDto; schedule: ScheduleDto[] }>;

  // Сохраняет одно бронирование
  saveOrder(order: OrderDocument): Promise<void>;

  // Возвращает документ фильма
  getFilmById(filmId: string): Promise<FilmDocument | undefined>;

  // Обновляет список занятых мест в конкретном сеансе фильма
  updateTakenSeats(
    filmId: string,
    sessionId: string,
    taken: string[],
  ): Promise<void>;
}
