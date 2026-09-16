import { DynamicModule, Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { RepositoryModule } from '../repository/repository.module';

@Module({})
export class FilmsModule {
  static register(useMongo: boolean): DynamicModule {
    return {
      module: FilmsModule,
      imports: [RepositoryModule.forRoot(useMongo)],
      controllers: [FilmsController],
      providers: [FilmsService],
    };
  }
}
