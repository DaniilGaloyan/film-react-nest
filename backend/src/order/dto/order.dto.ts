export class TicketDto {
  // Идентификатор фильма
  film: string;

  // Идентификатор сеанса
  session: string;

  // Дата и время сеанса
  daytime: string;

  // Номер ряда
  row: number;

  // Номер места
  seat: number;

  // Стоимость билета
  price: number;
}

export class CreateOrderDto {
  // Email пользователя
  email: string;

  // Телефон пользователя
  phone: string;

  // Массив билетов для бронирования
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
