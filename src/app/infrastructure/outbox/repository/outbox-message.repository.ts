import { IRepository } from '../../../domain/repositories/base.repository';
import {
  OutboxMessage,
  OutboxMessageStatus,
} from '../outbox-message/outbox-message.entity';

export interface Criteria {
  aggregateType?: string;
  aggregateId?: string;
  eventType?: string;
  status?: OutboxMessageStatus;
}

export interface IOutboxMessageRepository extends IRepository<OutboxMessage> {
  findBy(criteria?: Criteria): Promise<OutboxMessage[]>;
}
