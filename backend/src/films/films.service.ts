import { Injectable, Inject } from '@nestjs/common';
import {
  IRepository,
  REPOSITORY_TOKEN,
} from '../repository/repository.interface';
import { GetFilmsResponseDto, GetScheduleResponseDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(REPOSITORY_TOKEN) private readonly repository: IRepository,
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
    const result = await this.repository.findOne(id);

    return {
      total: result.schedule.length,
      items: result.schedule,
    };
  }
}
