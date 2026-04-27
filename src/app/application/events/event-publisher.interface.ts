import { DomainEvent } from "../../domain/repositories/base.repository";

export const EVENT_PUBLISHER = "EVENT_PUBLISHER";

export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;
}
