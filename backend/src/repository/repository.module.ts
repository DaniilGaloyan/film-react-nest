import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MemoryRepository } from './memory.repository';
import { MongoRepository } from './mongo.repository';
import { FilmDocument, FilmSchema } from './film.schema';
import { OrderDocument, OrderSchema } from './order.schema';

/**
 * Модуль репозитория — точка выбора хранилища
 *
 * Реализация определяется переменной USE_MONGODB:
 *  true  -  данные хранятся в MongoDB
 *  false -  данные хранятся в памяти
 */
@Module({})
export class RepositoryModule {
  static forRoot(): DynamicModule {
    const useMongo = process.env.USE_MONGODB === 'true';

    if (!useMongo) {
      return {
        module: RepositoryModule,
        providers: [MemoryRepository],
        exports: [MemoryRepository],
      };
    }

    return {
      module: RepositoryModule,
      imports: [
        ConfigModule,
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
        {
          provide: MemoryRepository,
          useClass: MongoRepository,
        },
      ],
      exports: [MemoryRepository],
    };
  }
}

export const REPOSITORY_MODULE = RepositoryModule.forRoot();
