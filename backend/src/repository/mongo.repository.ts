import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { FilmDocument } from './film.schema';
import { ScheduleDocument } from './schedule.schema';
import { OrderDocument } from './order.schema';
import { IRepository } from './repository.interface';

@Injectable()
export class MongoRepository implements IRepository {
  constructor(
    // Модель фильма
    @InjectModel(FilmDocument.name)
    private readonly filmModel: Model<FilmDocument>,

    // Модель заказа
    @InjectModel(OrderDocument.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  // Возвращает все фильмы
  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().exec();
    return films.map((film) => this.toFilmDto(film));
  }

  // Возвращает фильм и его расписание
  async findOne(
    filmId: string,
  ): Promise<{ film: FilmDto; schedule: ScheduleDto[] }> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();

    if (!film) {
      throw new NotFoundException(`Film with id ${filmId} not found`);
    }

    return {
      film: this.toFilmDto(film),
      schedule: film.schedule.map((s) => this.toScheduleDto(s)),
    };
  }

  // Сохраняет одно бронирование отдельным документом
  async saveOrder(order: OrderDocument): Promise<void> {
    await this.orderModel.create(order);
  }

  // Возвращает документ фильма
  async getFilmById(filmId: string): Promise<FilmDocument | undefined> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    return film ?? undefined;
  }

  // Обновляет список занятых мест в конкретном сеансе фильма
  async updateTakenSeats(
    filmId: string,
    sessionId: string,
    taken: string[],
  ): Promise<void> {
    await this.filmModel
      .updateOne(
        { id: filmId, 'schedule.id': sessionId },
        { $set: { 'schedule.$.taken': taken } },
      )
      .exec();
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
