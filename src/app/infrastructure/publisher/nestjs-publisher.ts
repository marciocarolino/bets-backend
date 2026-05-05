import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import type {
  CommandPublisher,
  EventPublisher,
} from "../../application/publisher/publisher.interface";
import type { DomainCommand } from "../../application/saga/commands/domain-command";
import type { DomainEvent } from "../../domain/repositories/base.repository";

@Injectable()
export class NestEventPublisher implements EventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publish(event: DomainEvent): Promise<void> {
    await this.eventEmitter.emitAsync(event.eventName, { ...event });
  }
}

@Injectable()
export class NestCommandPublisher implements CommandPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publish<TPayload = unknown>(
    command: DomainCommand<TPayload>,
  ): Promise<void> {
    await this.eventEmitter.emitAsync(command.commandName, { ...command });
  }
}
