import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { EventPublisher } from '../../application/events/event-publisher.interface';
import { DomainEvent } from '../../domain/repositories/base.repository';

@Injectable()
export class NestEventPublisher implements EventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publish(event: DomainEvent): Promise<void> {
    await this.eventEmitter.emitAsync(event.eventType, { ...event });
  }
}
