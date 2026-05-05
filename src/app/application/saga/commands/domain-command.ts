export interface DomainCommand<TPayload = unknown> {
  commandName: string;
  correlationId: string;
  targetAggregateType: string;
  targetAggregateId?: string;
  source: string;
  payload: TPayload;
  metadata?: Record<string, unknown>;
}
