import { Injectable } from '@nestjs/common';
import { MemoryRepository } from '../repository/memory.repository';
import { GetFilmsResponseDto } from './dto/films.dto';
import { GetScheduleResponseDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly repository: MemoryRepository) {}

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
