import { Injectable, NotFoundException } from '@nestjs/common';
import * as initialData from '../../test/mongodb_initial_stub.json';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { FilmDocument } from './film.schema';
import { ScheduleDocument } from './schedule.schema';
import { OrderDocument } from './order.schema';
import { IRepository } from './repository.interface';

// Реализация репозитория «в памяти»
@Injectable()
export class MemoryRepository implements IRepository {
  // Хранилище фильмов в памяти
  private films: FilmDocument[] = [];

  // Хранилище заказов в памяти
  private orders: OrderDocument[] = [];

  constructor() {
    // Копия данных из initialData
    this.films = JSON.parse(JSON.stringify(initialData));
  }

  // Возвращает все фильмы
  async findAll(): Promise<FilmDto[]> {
    return this.films.map((film) => this.toFilmDto(film));
  }

  // Возвращает фильм и его расписание
  async findOne(
    filmId: string,
  ): Promise<{ film: FilmDto; schedule: ScheduleDto[] }> {
    const film = this.films.find((f) => f.id === filmId);

    if (!film) {
      throw new NotFoundException(`Film with id ${filmId} not found`);
    }

    return {
      film: this.toFilmDto(film),
      schedule: film.schedule.map((s) => this.toScheduleDto(s)),
    };
  }

  // Сохраняет одно бронирование в массив заказов в памяти
  async saveOrder(order: OrderDocument): Promise<void> {
    this.orders.push(order);
  }

  // Возвращает документ фильма
  async getFilmById(filmId: string): Promise<FilmDocument | undefined> {
    return this.films.find((f) => f.id === filmId);
  }

  // Обновляет список занятых мест в конкретном сеансе фильма
  async updateTakenSeats(
    filmId: string,
    sessionId: string,
    taken: string[],
  ): Promise<void> {
    const film = this.films.find((f) => f.id === filmId);

    if (!film) {
      throw new NotFoundException(`Film with id ${filmId} not found`);
    }

    const session = film.schedule.find((s) => s.id === sessionId);

    if (!session) {
      throw new NotFoundException(`Session with id ${sessionId} not found`);
    }

    session.taken = taken;
  }

  // Преобразует документ фильма в FilmDto
  private toFilmDto(film: FilmDocument): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  // Преобразует документ сеанса в ScheduleDto
  private toScheduleDto(schedule: ScheduleDocument): ScheduleDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
    };
  }
}
