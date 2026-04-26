import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../../../prisma/prisma.service";
import { Game } from "../../domain/entities/game/game.entity";
import {
  GameCriteria,
  IGameRepository,
} from "../../domain/repositories/game/game.repository";
import { PrismaGameMapper } from "../mapper/prisma-gameMapper";

@Injectable()
export class PrismaGameRepository implements IGameRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBy(criteria?: GameCriteria): Promise<Game[]> {
    const data = await this.prisma.game.findMany({
      where: {
        teamAId: criteria?.teamAId,
        teamBId: criteria?.teamBId,
        status: criteria?.status,
      },
    });
    return data.map((item) => PrismaGameMapper.toDomain(item));
  }

  async findByTeam(teamId: string): Promise<Game[]> {
    const data = await this.prisma.game.findMany({
      where: {
        OR: [{ teamAId: teamId }, { teamBId: teamId }],
      },
    });
    return data.map((item) => PrismaGameMapper.toDomain(item));
  }

  async retrieve(id: string): Promise<Game | null> {
    const data = await this.prisma.game.findUnique({ where: { id } });
    if (!data) return null;
    return PrismaGameMapper.toDomain(data);
  }

  async save(entity: Game): Promise<Game> {
    const data = await this.prisma.game.upsert({
      where: { id: entity.identification.id },
      update: {
        scheduledAt: entity.schedule.value ?? null,
        isTBD: entity.schedule.isTBD,
        status: entity.status,
        updatedAt: entity.updatedAt,
      },
      create: PrismaGameMapper.toPrisma(entity),
    });
    return PrismaGameMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.game.delete({ where: { id } });
  }
}
