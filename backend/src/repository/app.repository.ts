import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { Film } from './film.entity';
import { Order } from './order.entity';
import { Schedule } from './schedule.entity';
import {
  FilmsRepository,
  SaveOrdersResult,
  SeatUpdate,
} from './repository.interface';

@Injectable()
export class AppRepository implements FilmsRepository {
  constructor(
    // Подключение к базе
    private readonly dataSource: DataSource,

    // Репозиторий фильмов
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
  ) {}

  // Возвращает все фильмы
  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find({
      relations: { schedules: true },
      order: { schedules: { daytime: 'ASC', hall: 'ASC' } },
    });

    return films.map((film) => this.toFilmDto(film));
  }

  // Возвращает расписание фильма или null, если фильм не найден
  async findSchedule(filmId: string): Promise<ScheduleDto[] | null> {
    const film = await this.findFilmWithSchedules(filmId);

    if (!film) {
      return null;
    }

    return film.schedules.map((schedule) => this.toScheduleDto(schedule));
  }

  // Возвращает фильм вместе с сеансами
  async getFilmById(filmId: string): Promise<Film | undefined> {
    return this.findFilmWithSchedules(filmId);
  }

  // Сохраняет заказы и отмечает места занятыми, если нет ошибок
  async saveOrders(
    orders: Order[],
    seatUpdates: SeatUpdate[],
  ): Promise<SaveOrdersResult> {
    return this.dataSource.transaction(async (manager) => {
      const scheduleRepository = manager.getRepository(Schedule);
      const orderRepository = manager.getRepository(Order);

      // Блокируем строки сеансов, которых касается заказ
      await manager
        .createQueryBuilder(Schedule, 'schedule')
        .select('schedule.id')
        .where('schedule.id IN (:...sessionIds)', {
          sessionIds: seatUpdates.map((update) => update.sessionId),
        })
        .setLock('pessimistic_write')
        .getRawMany();

      // Повторная проверка занятости (так как их мог занять параллельный заказ)
      const currentTaken = new Map<string, string[]>();

      for (const update of seatUpdates) {
        const schedule = await scheduleRepository.findOne({
          where: { id: update.sessionId },
        });

        if (!schedule || schedule.filmId !== update.filmId) {
          return {
            success: false,
            reason: 'session-not-found',
            sessionId: update.sessionId,
          };
        }

        const conflict = update.seats.find((seat) =>
          schedule.taken.includes(seat),
        );

        if (conflict) {
          return {
            success: false,
            reason: 'seat-already-taken',
            sessionId: update.sessionId,
            seat: conflict,
          };
        }

        currentTaken.set(update.sessionId, schedule.taken);
      }

      await orderRepository.insert(orders);

      // Отметки занятости с учётом уже занятых мест
      for (const update of seatUpdates) {
        await scheduleRepository.update(
          { id: update.sessionId, filmId: update.filmId },
          {
            taken: [
              ...(currentTaken.get(update.sessionId) ?? []),
              ...update.seats,
            ],
          },
        );
      }

      return { success: true };
    });
  }

  // Запрос фильма вместе с сеансами
  private async findFilmWithSchedules(
    filmId: string,
  ): Promise<Film | undefined> {
    if (!isUUID(filmId)) {
      return undefined;
    }

    const film = await this.filmRepository.findOne({
      where: { id: filmId },
      relations: { schedules: true },
      order: { schedules: { daytime: 'ASC', hall: 'ASC' } },
    });

    return film ?? undefined;
  }

  // Преобразует сущность фильма в FilmDto
  private toFilmDto(film: Film): FilmDto {
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
      schedule: (film.schedules ?? []).map((schedule) =>
        this.toScheduleDto(schedule),
      ),
    };
  }

  // Преобразует сущность сеанса в ScheduleDto
  private toScheduleDto(schedule: Schedule): ScheduleDto {
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
