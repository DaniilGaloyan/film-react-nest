import { DynamicModule, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { RepositoryModule } from '../repository/repository.module';

@Module({})
export class OrderModule {
  static register(useMongo: boolean): DynamicModule {
    return {
      module: OrderModule,
      imports: [RepositoryModule.forRoot(useMongo)],
      controllers: [OrderController],
      providers: [OrderService],
    };
  }
}
