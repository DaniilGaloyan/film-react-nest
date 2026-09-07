import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MemoryRepository } from '../repository/memory.repository';
import { FilmDocument } from '../repository/film.schema';
import { ScheduleDocument } from '../repository/schedule.schema';
import {
  CreateOrderDto,
  OrderItemResponseDto,
  CreateOrderResponseDto,
  TicketDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly repository: MemoryRepository) {}

  async createOrder(dto: CreateOrderDto): Promise<CreateOrderResponseDto> {
    // Проверка дублей мест внутри одного заказа
    this.assertNoDuplicateTickets(dto.tickets);

    // Валидация каждого билета и сбор новых занятых мест
    const takenBySession = new Map<
      string,
      { film: FilmDocument; session: ScheduleDocument; seats: string[] }
    >();
    const items: OrderItemResponseDto[] = [];

    for (const ticket of dto.tickets) {
      const { film, session } = await this.getFilmSessionOrThrow(
        ticket.film,
        ticket.session,
      );

      const seatKey = `${ticket.row}:${ticket.seat}`;

      if (session.taken.includes(seatKey)) {
        throw new BadRequestException(
          `Seat ${seatKey} is already taken for session ${ticket.session}`,
        );
      }

      const groupKey = `${ticket.film}:${ticket.session}`;
      let group = takenBySession.get(groupKey);

      if (!group) {
        group = { film, session, seats: [] };
        takenBySession.set(groupKey, group);
      }
      group.seats.push(seatKey);

      const order = {
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

      await this.repository.saveOrder(order);

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

    // Обновляем списки занятых мест
    for (const { film, session, seats } of takenBySession.values()) {
      await this.repository.updateTakenSeats(film.id, session.id, [
        ...session.taken,
        ...seats,
      ]);
    }

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

  // Находит фильм и сеанс по идентификаторам билета
  private async getFilmSessionOrThrow(
    filmId: string,
    sessionId: string,
  ): Promise<{ film: FilmDocument; session: ScheduleDocument }> {
    const film = await this.repository.getFilmById(filmId);

    if (!film) {
      throw new BadRequestException(`Film with id ${filmId} not found`);
    }

    const session = film.schedule.find((s) => s.id === sessionId);

    if (!session) {
      throw new BadRequestException(`Session with id ${sessionId} not found`);
    }

    return { film, session };
  }
}
