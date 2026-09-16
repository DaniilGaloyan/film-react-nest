import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { GetFilmsResponseDto, GetScheduleResponseDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  // Возвращает список всех фильмов
  @Get()
  async findAll(): Promise<GetFilmsResponseDto> {
    return this.filmsService.findAll();
  }

  // Возвращает расписание конкретного фильма
  @Get(':id/schedule')
  async findOne(@Param('id') id: string): Promise<GetScheduleResponseDto> {
    return this.filmsService.findOne(id);
  }
}
