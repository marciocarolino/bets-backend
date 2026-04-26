import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../../../prisma/prisma.service";
import { Competition } from "../../domain/entities/competition/competition.entity";
import { DomainEvent } from "../../domain/repositories/base.repository";
import {
  CompetitionCriteria,
  ICompetitionRepository,
} from "../../domain/repositories/competition/competition.repository";
import { PrismaCompetitionMapper } from "../mapper/prisma-competitionMapper";
import { outboxOps } from "../outbox/outbox-transaction.helper";

@Injectable()
export class PrismaCompetitionRepository implements ICompetitionRepository {
  constructor(private readonly prisma: PrismaService) {}

  //TODO: Implementar paginação e ordenação | paginação por cursor.
  async findBy(criteria?: CompetitionCriteria): Promise<Competition[]> {
    const data = await this.prisma.competition.findMany({
      where: {
        name: criteria?.name,
        slug: criteria?.slug,
        country: criteria?.country,
        season: criteria?.season,
      },
    });
    return data.map((item) => PrismaCompetitionMapper.toDomain(item));
  }

  async retrieve(id: string): Promise<Competition | null> {
    const data = await this.prisma.competition.findUnique({
      where: { id },
    });
    if (!data) return null;
    return PrismaCompetitionMapper.toDomain(data);
  }

  //TODO: Adicionar try/catch e validar erro de constraint violation.
  async save(
    entity: Competition,
    events: DomainEvent[] = [],
  ): Promise<Competition> {
    const upsertOp = this.prisma.competition.upsert({
      where: { id: entity.identification.id },
      update: {
        name: entity.name,
        country: entity.country,
        season: entity.season,
        updatedAt: entity.updatedAt,
      },
      create: PrismaCompetitionMapper.toPrisma(entity),
    });

    const [saved] = await this.prisma.$transaction([
      upsertOp,
      ...outboxOps(this.prisma, events),
    ]);

    return PrismaCompetitionMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.competition.delete({
      where: { id },
    });
  }
}
