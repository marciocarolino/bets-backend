import { Injectable } from '@nestjs/common';
import {
  ITeamRepository,
  TeamCriteria,
} from '../../domain/repositories/team/team.repository';
import { Team } from '../../domain/entities/team/team.entity';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PrismaTeamMapper } from '../mapper/prisma-teamMapper';

@Injectable()
export class PrismaTeamRepository implements ITeamRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBy(criteria?: TeamCriteria): Promise<Team[]> {
    const data = await this.prisma.team.findMany({
      where: {
        name: criteria?.name,
        alias: criteria?.alias,
      },
    });
    return data.map((item) => PrismaTeamMapper.toDomain(item));
  }

  async findByAlias(alias: string): Promise<Team | null> {
    const data = await this.prisma.team.findUnique({ where: { alias } });
    if (!data) return null;
    return PrismaTeamMapper.toDomain(data);
  }

  async retrieve(id: string): Promise<Team | null> {
    const data = await this.prisma.team.findUnique({ where: { id } });
    if (!data) return null;
    return PrismaTeamMapper.toDomain(data);
  }

  async save(entity: Team): Promise<Team> {
    const data = await this.prisma.team.upsert({
      where: { alias: entity.teamName.alias },
      update: {
        name: entity.teamName.name,
        updatedAt: entity.updatedAt,
      },
      create: PrismaTeamMapper.toPrisma(entity),
    });
    return PrismaTeamMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.team.delete({ where: { id } });
  }
}
