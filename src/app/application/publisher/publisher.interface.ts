import { DomainEvent } from "../../domain/repositories/base.repository";
import type { DomainCommand } from "../saga/commands/domain-command";

export const EVENT_PUBLISHER = Symbol("EventPublisher");
export const COMMAND_PUBLISHER = Symbol("CommandPublisher");

export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
}
export interface CommandPublisher {
  publish<TPayload = unknown>(command: DomainCommand<TPayload>): Promise<void>;
}
