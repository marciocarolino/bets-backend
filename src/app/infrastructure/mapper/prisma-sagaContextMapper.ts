import { Prisma, SagaContext as PrismaSagaContext } from "@prisma/client";
import type { UUID } from "crypto";

import {
  SagaContext as SagaContextEntity,
  SagaContextStatus,
} from "../../application/saga/saga-context/saga-context.entity";
import { Identification } from "../../domain/base";

export class PrismaSagaContextMapper {
  static toDomain(data: PrismaSagaContext): SagaContextEntity {
    return new SagaContextEntity(
      new Identification(data.id as UUID),
      {
        sagaName: data.sagaName,
        externalId: data.externalId ?? undefined,
        rawDataHash: data.rawDataHash,
        status: data.status as unknown as SagaContextStatus,
        currentStep: data.currentStep,
        rawData: data.rawData as Record<string, unknown>,
        processData: data.processData as Record<string, unknown>,
        logs: data.logs,
        error: data.error,
        retryCount: data.retryCount,
        version: data.version,
      },
      data.createdAt,
      data.updatedAt,
    );
  }

  static toPrisma(
    entity: SagaContextEntity,
  ): Prisma.SagaContextUncheckedCreateInput {
    return {
      id: entity.identification.id,
      sagaName: entity.sagaName,
      externalId: entity.externalId,
      rawDataHash: entity.rawDataHash,
      status: entity.status,
      currentStep: entity.currentStep,
      rawData: entity.rawData as Prisma.InputJsonValue,
      processData: entity.processData as Prisma.InputJsonValue,
      logs: [...entity.logs],
      error: entity.error,
      retryCount: entity.retryCount,
      version: entity.version,
    };
  }
}
