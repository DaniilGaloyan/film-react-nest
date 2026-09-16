import {
  IsString,
  IsNumber,
  IsArray,
  Min,
  ArrayMinSize,
  IsEmail,
} from 'class-validator';

export class TicketDto {
  // Идентификатор фильма
  @IsString()
  film: string;

  // Идентификатор сеанса
  @IsString()
  session: string;

  // Дата и время сеанса
  @IsString()
  daytime: string;

  // Номер ряда
  @IsNumber()
  @Min(1)
  row: number;

  // Номер места
  @IsNumber()
  @Min(1)
  seat: number;

  // Стоимость билета
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  // Email пользователя
  @IsEmail()
  email: string;

  // Телефон пользователя
  @IsString()
  phone: string;

  // Массив билетов для бронирования
  @IsArray()
  @ArrayMinSize(1)
  tickets: TicketDto[];
}

export class OrderItemResponseDto extends TicketDto {
  // Уникальный идентификатор бронирования
  id: string;
}

export class CreateOrderResponseDto {
  // Общее количество забронированных билетов
  total: number;

  // Массив забронированных билетов
  items: OrderItemResponseDto[];
}
