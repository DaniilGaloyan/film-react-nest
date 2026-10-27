import { Injectable, Inject } from '@nestjs/common';
import {
  FilmsRepository,
  REPOSITORY_TOKEN,
} from '../repository/repository.interface';
import { GetFilmsResponseDto, GetScheduleResponseDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(REPOSITORY_TOKEN) private readonly repository: FilmsRepository,
  ) {}

  // Возвращает список всех фильмов
  async findAll(): Promise<GetFilmsResponseDto> {
    const films = await this.repository.findAll();
    return {
      total: films.length,
      items: films,
    };
  }

  // Возвращает расписание конкретного фильма
  async findOne(id: string): Promise<GetScheduleResponseDto> {
    const schedule = await this.repository.findSchedule(id);

    return {
      total: schedule.length,
      items: schedule,
    };
  }
}
