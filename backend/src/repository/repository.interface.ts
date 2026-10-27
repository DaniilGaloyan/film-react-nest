import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { Film } from './film.entity';
import { Order } from './order.entity';

export const REPOSITORY_TOKEN = 'FILMS_REPOSITORY';

// Новые занятые места одного сеанса (в виде «ряд:место»)
export interface SeatUpdate {
  // Идентификатор фильма
  filmId: string;

  // Идентификатор сеанса
  sessionId: string;

  // Новые занятые места; существующие места добавятся к ним при сохранении
  seats: string[];
}

export interface FilmsRepository {
  // Возвращает все фильмы
  findAll(): Promise<FilmDto[]>;

  // Возвращает расписание фильма
  findSchedule(filmId: string): Promise<ScheduleDto[]>;

  // Возвращает фильм вместе с сеансами для проверки и бронирования мест
  getFilmById(filmId: string): Promise<Film | undefined>;

  // Сохраняет заказы и отмечает места занятыми, если нет ошибок
  saveOrders(orders: Order[], seatUpdates: SeatUpdate[]): Promise<void>;
}
