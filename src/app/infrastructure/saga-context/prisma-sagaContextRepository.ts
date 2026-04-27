import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../../../prisma/prisma.service";
import type {
  Criteria,
  ISagaContextRepository,
} from "../../application/saga/repository/saga-context.repository";
import { SagaContext as SagaContextEntity } from "../../application/saga/saga-context/saga-context.entity";
import { PrismaSagaContextMapper } from "../mapper/prisma-sagaContextMapper";

@Injectable()
export class PrismaSagaContextRepository implements ISagaContextRepository {
  constructor(private readonly prisma: PrismaService) {}

  async retrieve(id: string): Promise<SagaContextEntity | null> {
    const data = await this.prisma.sagaContext.findUnique({
      where: { id },
    });
    return data ? PrismaSagaContextMapper.toDomain(data) : null;
  }

  async findBy(criteria?: Criteria): Promise<SagaContextEntity[]> {
    const data = await this.prisma.sagaContext.findMany({
      where: {
        sagaName: criteria?.sagaName,
        externalId: criteria?.externalId,
        rawDataHash: criteria?.rawDataHash,
        status: criteria?.status,
      },
    });
    return data.map((item) => PrismaSagaContextMapper.toDomain(item));
  }

  async save(entity: SagaContextEntity): Promise<SagaContextEntity> {
    const mapped = PrismaSagaContextMapper.toPrisma(entity);
    const data = await this.prisma.sagaContext.upsert({
      where: { id: entity.identification.id },
      update: {
        ...mapped,
        version: { increment: 1 },
      },
      create: mapped,
    });
    return PrismaSagaContextMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.sagaContext.delete({
      where: { id },
    });
  }
}
