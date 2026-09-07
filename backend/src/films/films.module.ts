import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { REPOSITORY_MODULE } from '../repository/repository.module';

@Module({
  imports: [REPOSITORY_MODULE],
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {}
