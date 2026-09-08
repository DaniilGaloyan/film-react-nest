import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MemoryRepository } from './memory.repository';
import { MongoRepository } from './mongo.repository';
import { FilmDocument, FilmSchema } from './film.schema';
import { OrderDocument, OrderSchema } from './order.schema';
import { REPOSITORY_TOKEN } from './repository.interface';

/**
 * Модуль репозитория — точка выбора хранилища
 *
 * Реализация определяется флагом useMongo, который приходит из main.ts:
 *  true  -  данные хранятся в MongoDB
 *  false -  данные хранятся в памяти
 */
@Module({})
export class RepositoryModule {
  static forRoot(useMongo: boolean): DynamicModule {
    return useMongo ? this.forMongo() : this.forMemory();
  }

  // Режим MongoDB
  private static forMongo(): DynamicModule {
    return {
      module: RepositoryModule,
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            uri: configService.get<string>('DATABASE_URL'),
          }),
        }),
        MongooseModule.forFeature([
          { name: FilmDocument.name, schema: FilmSchema },
          { name: OrderDocument.name, schema: OrderSchema },
        ]),
      ],
      providers: [
        MongoRepository,
        {
          provide: REPOSITORY_TOKEN,
          useExisting: MongoRepository,
        },
      ],
      exports: [REPOSITORY_TOKEN],
    };
  }

  // Режим в памяти
  private static forMemory(): DynamicModule {
    return {
      module: RepositoryModule,
      imports: [],
      providers: [
        MemoryRepository,
        {
          provide: REPOSITORY_TOKEN,
          useExisting: MemoryRepository,
        },
      ],
      exports: [REPOSITORY_TOKEN],
    };
  }
}
