import { DynamicModule, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({})
export class AppModule {
  static register(useMongo: boolean): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
        }),
        ServeStaticModule.forRoot({
          rootPath: path.join(__dirname, '..', '..', 'public'),
        }),
        FilmsModule.register(useMongo),
        OrderModule.register(useMongo),
      ],
    };
  }
}
