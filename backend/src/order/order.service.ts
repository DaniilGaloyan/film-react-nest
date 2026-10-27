import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  FilmsRepository,
  REPOSITORY_TOKEN,
  SeatUpdate,
} from '../repository/repository.interface';
import { Film } from '../repository/film.entity';
import { Schedule } from '../repository/schedule.entity';
import { Order } from '../repository/order.entity';
import {
  CreateOrderDto,
  OrderItemResponseDto,
  CreateOrderResponseDto,
  TicketDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(REPOSITORY_TOKEN) private readonly repository: FilmsRepository,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<CreateOrderResponseDto> {
    // Проверка дублей мест внутри одного заказа
    this.assertNoDuplicateTickets(dto.tickets);

    const films = new Map<string, Film>();

    const orders: Order[] = [];
    const items: OrderItemResponseDto[] = [];
    const seatUpdates = new Map<string, SeatUpdate>();

    for (const ticket of dto.tickets) {
      const session = await this.getSessionOrThrow(
        films,
        ticket.film,
        ticket.session,
      );

      // Место должно существовать в зале
      this.assertSeatWithinHall(ticket, session);

      const seatKey = `${ticket.row}:${ticket.seat}`;

      // Если место уже занято, заказ целиком отклоняется
      if (session.taken.includes(seatKey)) {
        throw new BadRequestException(
          `Seat ${seatKey} is already taken for session ${ticket.session}`,
        );
      }

      const groupKey = `${ticket.film}:${ticket.session}`;
      let update = seatUpdates.get(groupKey);

      if (!update) {
        update = { filmId: ticket.film, sessionId: ticket.session, seats: [] };
        seatUpdates.set(groupKey, update);
      }
      update.seats.push(seatKey);

      const order: Order = {
        id: uuidv4(),
        email: dto.email,
        phone: dto.phone,
        film: ticket.film,
        session: ticket.session,
        daytime: ticket.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: ticket.price,
      };

      orders.push(order);

      items.push({
        id: order.id,
        film: order.film,
        session: order.session,
        daytime: order.daytime,
        row: order.row,
        seat: order.seat,
        price: order.price,
      });
    }

    await this.repository.saveOrders(orders, [...seatUpdates.values()]);

    return {
      total: items.length,
      items,
    };
  }

  // Проверка дублей мест внутри одного заказа
  private assertNoDuplicateTickets(tickets: TicketDto[]): void {
    const seen = new Set<string>();

    for (const ticket of tickets) {
      const key = `${ticket.film}:${ticket.session}:${ticket.row}:${ticket.seat}`;

      if (seen.has(key)) {
        throw new BadRequestException(
          `Duplicate seat ${ticket.row}:${ticket.seat} for session ${ticket.session}`,
        );
      }

      seen.add(key);
    }
  }

  // Проверяет, что место существует в зале
  private assertSeatWithinHall(ticket: TicketDto, session: Schedule): void {
    if (ticket.row < 1 || ticket.row > session.rows) {
      throw new BadRequestException(
        `Row ${ticket.row} is out of range 1..${session.rows}`,
      );
    }

    if (ticket.seat < 1 || ticket.seat > session.seats) {
      throw new BadRequestException(
        `Seat ${ticket.seat} is out of range 1..${session.seats}`,
      );
    }
  }

  // Находит сеанс по идентификаторам билета
  private async getSessionOrThrow(
    films: Map<string, Film>,
    filmId: string,
    sessionId: string,
  ): Promise<Schedule> {
    let film = films.get(filmId);

    if (!film) {
      film = await this.repository.getFilmById(filmId);
    }

    if (!film) {
      throw new BadRequestException(`Film with id ${filmId} not found`);
    }

    films.set(filmId, film);

    const session = film.schedules.find((s) => s.id === sessionId);

    if (!session) {
      throw new BadRequestException(`Session with id ${sessionId} not found`);
    }

    return session;
  }
}
