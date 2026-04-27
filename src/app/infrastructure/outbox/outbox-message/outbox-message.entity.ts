import { Entity, Identification } from "../../../domain/base";

export enum OutboxMessageStatus {
  PENDING = "PENDING",
  PROCESSED = "PROCESSED",
  FAILED = "FAILED",
}

export class OutboxMessage extends Entity {
  private readonly _aggregateType: string;
  private readonly _aggregateId: string;
  private readonly _eventType: string;
  private readonly _payload: Record<string, unknown>;
  private _status: OutboxMessageStatus;
  private _retryCount: number;
  private _processedAt: Date | null;

  constructor(
    identification: Identification,
    aggregateType: string,
    aggregateId: string,
    eventType: string,
    payload: Record<string, unknown>,
    status: OutboxMessageStatus,
    retryCount: number,
    processedAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(identification, createdAt, updatedAt);
    this._aggregateType = aggregateType;
    this._aggregateId = aggregateId;
    this._eventType = eventType;
    this._payload = Object.freeze({ ...payload });
    this._status = status;
    this._retryCount = retryCount;
    this._processedAt = processedAt;
  }

  get aggregateType(): string {
    return this._aggregateType;
  }
  get aggregateId(): string {
    return this._aggregateId;
  }
  get eventType(): string {
    return this._eventType;
  }
  get payload(): Record<string, unknown> {
    return { ...this._payload };
  }
  get status(): OutboxMessageStatus {
    return this._status;
  }
  get retryCount(): number {
    return this._retryCount;
  }
  get processedAt(): Date | null {
    return this._processedAt;
  }

  public markProcessed(): void {
    this._status = OutboxMessageStatus.PROCESSED;
    this._processedAt = new Date();
    this.markAsUpdated();
  }

  public markFailed(): void {
    this._status = OutboxMessageStatus.FAILED;
    this._retryCount += 1;
    this.markAsUpdated();
  }

  public incrementRetryCount(): void {
    this._retryCount += 1;
  }

  public static create(
    aggregateType: string,
    aggregateId: string,
    eventType: string,
    payload: Record<string, unknown>,
  ): OutboxMessage {
    const now = new Date();
    return new OutboxMessage(
      new Identification(),
      aggregateType,
      aggregateId,
      eventType,
      payload,
      OutboxMessageStatus.PENDING,
      0,
      null,
      now,
      now,
    );
  }
}
