export class FilmDto {
  // Уникальный идентификатор фильма
  id: string;

  // Рейтинг фильма
  rating: number;

  // Режиссёр фильма
  director: string;

  // Теги фильма
  tags: string[];

  // Название фильма
  title: string;

  // Краткое описание
  about: string;

  // Полное описание фильма
  description: string;

  // Путь к изображению
  image: string;

  // Путь к обложке фильма
  cover: string;
}

export class ScheduleDto {
  // Уникальный идентификатор сеанса
  id: string;

  // Дата и время начала сеанса
  daytime: string;

  // Номер зала
  hall: number;

  // Количество рядов в зале
  rows: number;

  // Количество мест в ряду
  seats: number;

  // Стоимость билета
  price: number;

  // Список занятых мест
  taken?: string[];
}

export class GetFilmsResponseDto {
  // Общее количество фильмов
  total: number;

  // Массив фильмов
  items: FilmDto[];
}

export class GetScheduleResponseDto {
  // Общее количество сеансов
  total: number;

  // Массив сеансов
  items: ScheduleDto[];
}
