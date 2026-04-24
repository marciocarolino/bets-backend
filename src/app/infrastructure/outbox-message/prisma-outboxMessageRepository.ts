import type { IOutboxMessageRepository } from '../outbox/repository/outbox-message.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { OutboxMessage } from '../outbox/outbox-message/outbox-message.entity';
import { PrismaOutboxMessageMapper } from '../mapper/prisma-outboxMessageMapper';
import { Criteria } from '../../infrastructure/outbox/repository/outbox-message.repository';

@Injectable()
export class PrismaOutboxMessageRepository implements IOutboxMessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async retrieve(id: string): Promise<OutboxMessage | null> {
    const data = await this.prisma.outboxMessage.findUnique({
      where: { id },
    });
    return data ? PrismaOutboxMessageMapper.toDomain(data) : null;
  }

  async findBy(criteria?: Criteria): Promise<OutboxMessage[]> {
    const data = await this.prisma.outboxMessage.findMany({
      where: {
        aggregateType: criteria?.aggregateType,
        aggregateId: criteria?.aggregateId,
        eventType: criteria?.eventType,
        status: criteria?.status,
      },
    });
    return data.map((item) => PrismaOutboxMessageMapper.toDomain(item));
  }

  async save(entity: OutboxMessage): Promise<OutboxMessage> {
    const mapped = PrismaOutboxMessageMapper.toPrisma(entity);
    const data = await this.prisma.outboxMessage.upsert({
      where: { id: entity.identification.id },
      update: mapped,
      create: mapped,
    });
    return PrismaOutboxMessageMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.outboxMessage.delete({
      where: { id },
    });
  }
}
