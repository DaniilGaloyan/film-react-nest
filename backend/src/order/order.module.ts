import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { REPOSITORY_MODULE } from '../repository/repository.module';

@Module({
  imports: [REPOSITORY_MODULE],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
