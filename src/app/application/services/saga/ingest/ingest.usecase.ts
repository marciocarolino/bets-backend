import { Inject, Injectable } from "@nestjs/common";

import { SagaContextDuplicateException } from "../../../../utils/exception.utils";
import type { EventPublisher } from "../../../publisher/publisher.interface";
import { EVENT_PUBLISHER } from "../../../publisher/publisher.interface";
import type { ISagaContextRepository } from "../../../saga/repository/saga-context.repository";
import { SAGA_CONTEXT_REPOSITORY_TOKEN } from "../../../saga/repository/saga-context-repository.token";
import { SagaContext } from "../../../saga/saga-context/saga-context.entity";
import { Usecase } from "../../base.usecase";

export interface Input {
  sagaName: string;
  rawData: Record<string, unknown>;
  externalId?: string;
}

export interface Output {
  id: string;
  correlationId: string;
}

@Injectable()
export class IngestSagaStartUsecase implements Usecase<Input, Output> {
  constructor(
    @Inject(SAGA_CONTEXT_REPOSITORY_TOKEN)
    private readonly sagaRepository: ISagaContextRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(input: Input): Promise<Output> {
    const hashCode = SagaContext.createRawDataSnapshot(input.rawData).hashCode;
    const existing = await this.sagaRepository.findBy({
      rawDataHash: hashCode,
      sagaName: input.sagaName,
    });

    if (existing.length > 0) {
      throw new SagaContextDuplicateException("Saga context already exists");
    }

    const saga = SagaContext.create(
      input.sagaName,
      input.rawData,
      input.externalId,
    );

    const saved = await this.sagaRepository.save(saga);

    await this.eventPublisher.publish({
      eventName: "evt.saga",
      eventType: this.deriveStartEventType(input.sagaName),
      aggregateType: "SagaContext",
      aggregateId: saved.identification.id,
      correlationId: saved.correlationIdValue,
      payload: {
        rawData: input.rawData,
        externalId: input.externalId,
      },
    });

    return {
      id: saved.identification.id,
      correlationId: saved.correlationIdValue,
    };
  }

  private deriveStartEventType(sagaName: string): string {
    return (
      sagaName
        .replace(/Saga$/i, "")
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .toLowerCase() + ".started"
    );
  }
}
