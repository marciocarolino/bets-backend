import { IRepository } from "../../domain/repositories/base.repository";
import {
  OutboxMessage,
  OutboxMessageStatus,
} from "./outbox-message/outbox-message.entity";

export const OUTBOX_MESSAGE_REPOSITORY = "OUTBOX_MESSAGE_REPOSITORY";

export interface OutboxCriteria {
  status?: OutboxMessageStatus;
  aggregateType?: string;
  aggregateId?: string;
}

export interface IOutboxMessageRepository extends IRepository<OutboxMessage> {
  findBy(criteria?: OutboxCriteria): Promise<OutboxMessage[]>;
}
