import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppRepository } from './app.repository';
import { Film } from './film.entity';
import { Order } from './order.entity';
import { REPOSITORY_TOKEN } from './repository.interface';
import { Schedule } from './schedule.entity';

// Модуль репозитория
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const driver = configService.get<string>('DATABASE_DRIVER');
        if (driver !== 'postgres') {
          throw new Error(
            `DATABASE_DRIVER должен быть равен "postgres", получено: ${driver}`,
          );
        }

        const databaseUrl = new URL(
          configService.getOrThrow<string>('DATABASE_URL'),
        );

        return {
          type: 'postgres',
          host: databaseUrl.hostname,
          port: Number(databaseUrl.port) || 5432,
          database: databaseUrl.pathname.replace(/^\//, ''),
          username: configService.getOrThrow<string>('DATABASE_USERNAME'),
          password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
          entities: [Film, Schedule, Order],
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature([Film]),
  ],
  providers: [
    AppRepository,
    {
      provide: REPOSITORY_TOKEN,
      useExisting: AppRepository,
    },
  ],
  exports: [REPOSITORY_TOKEN],
})
export class RepositoryModule {}
