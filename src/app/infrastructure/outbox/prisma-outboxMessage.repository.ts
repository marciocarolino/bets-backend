import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../prisma/prisma.service';
import { PrismaOutboxMessageMapper } from '../mapper/prisma-outboxMessageMapper';
import type { IOutboxMessageRepository } from './outbox.repository';
import { OutboxCriteria } from './outbox.repository';
import { OutboxMessage } from './outbox-message/outbox-message.entity';

@Injectable()
export class PrismaOutboxMessageRepository implements IOutboxMessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBy(criteria?: OutboxCriteria): Promise<OutboxMessage[]> {
    const rows = await this.prisma.outboxMessage.findMany({
      where: {
        status: criteria?.status,
        aggregateType: criteria?.aggregateType,
        aggregateId: criteria?.aggregateId,
      },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((row) => PrismaOutboxMessageMapper.toDomain(row));
  }

  async retrieve(id: string): Promise<OutboxMessage | null> {
    const row = await this.prisma.outboxMessage.findUnique({ where: { id } });
    return row ? PrismaOutboxMessageMapper.toDomain(row) : null;
  }

  async save(message: OutboxMessage): Promise<OutboxMessage> {
    const row = await this.prisma.outboxMessage.update({
      where: { id: message.identification.id },
      data: {
        status: message.status,
        retryCount: message.retryCount,
        processedAt: message.processedAt,
      },
    });
    return PrismaOutboxMessageMapper.toDomain(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.outboxMessage.delete({ where: { id } });
  }
}
