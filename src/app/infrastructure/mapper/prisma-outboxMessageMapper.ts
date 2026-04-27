import { OutboxMessage as PrismaOutboxMessage, Prisma } from "@prisma/client";
import type { UUID } from "crypto";

import { Identification } from "../../domain/base";
import {
  OutboxMessage,
  OutboxMessageStatus,
} from "../outbox/outbox-message/outbox-message.entity";

export class PrismaOutboxMessageMapper {
  static toDomain(data: PrismaOutboxMessage): OutboxMessage {
    return new OutboxMessage(
      new Identification(data.id as UUID),
      data.aggregateType,
      data.aggregateId,
      data.eventType,
      data.payload as Record<string, unknown>,
      data.status as unknown as OutboxMessageStatus,
      data.retryCount,
      data.processedAt,
      data.createdAt,
      data.createdAt,
    );
  }

  static toPrisma(entity: OutboxMessage): Prisma.OutboxMessageCreateInput {
    return {
      id: entity.identification.id,
      aggregateType: entity.aggregateType,
      aggregateId: entity.aggregateId,
      eventType: entity.eventType,
      payload: entity.payload as Prisma.InputJsonValue,
      status: entity.status,
      retryCount: entity.retryCount,
      processedAt: entity.processedAt,
    };
  }
}
