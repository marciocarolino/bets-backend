import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { PrismaModule } from '../../../../prisma/prisma.module';
import { EVENT_PUBLISHER } from '../../application/events/event-publisher.interface';
import { NestEventPublisher } from '../../infrastructure/events/nestjs-event-publisher';
import { OUTBOX_MESSAGE_REPOSITORY } from '../../infrastructure/outbox/outbox.repository';
import { PrismaOutboxMessageRepository } from '../../infrastructure/outbox/prisma-outboxMessage.repository';
import { OutboxWorker } from '../../infrastructure/works/outbox.worker';

@Module({
  imports: [PrismaModule, EventEmitterModule],
  controllers: [],
  providers: [
    OutboxWorker,
    {
      provide: EVENT_PUBLISHER,
      useClass: NestEventPublisher,
    },
    {
      provide: OUTBOX_MESSAGE_REPOSITORY,
      useClass: PrismaOutboxMessageRepository,
    },
  ],
  exports: [OutboxWorker],
})
export class OutboxModule {}
