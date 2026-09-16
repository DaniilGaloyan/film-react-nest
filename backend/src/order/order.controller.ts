import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, CreateOrderResponseDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Создаёт заказ на бронирование билетов
  @Post()
  async createOrder(
    @Body() dto: CreateOrderDto,
  ): Promise<CreateOrderResponseDto> {
    return this.orderService.createOrder(dto);
  }
}
