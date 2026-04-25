import { Prisma, PrismaClient } from '@prisma/client';

import { DomainEvent } from '../../domain/repositories/base.repository';

export function outboxOps(
  prisma: Omit<
    PrismaClient,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  events: DomainEvent[],
) {
  return events.map((e) =>
    prisma.outboxMessage.create({
      data: {
        aggregateType: e.aggregateType,
        aggregateId: e.aggregateId,
        eventType: e.eventType,
        payload: e.payload as Prisma.InputJsonValue,
      },
    }),
  );
}
