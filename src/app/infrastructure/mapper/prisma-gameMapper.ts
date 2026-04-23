import { Game as PrismaGame } from '@prisma/client';
import { Game } from '../../domain/entities/game/game.entity';
import { Identification } from '../../domain/base';
import { MatchSchedule } from '../../domain/value_objects/matchSchedule.vo';
import { UUID } from 'crypto';

export class PrismaGameMapper {
  static toDomain(data: PrismaGame): Game {
    const schedule = data.isTBD
      ? MatchSchedule.createTBD()
      : MatchSchedule.create(data.scheduledAt!);

    return new Game(
      new Identification(data.id as UUID),
      new Identification(data.teamAId as UUID),
      new Identification(data.teamBId as UUID),
      new Identification(data.competitionId as UUID),
      schedule,
      data.createdAt,
      data.updatedAt,
    );
  }

  static toPrisma(entity: Game): Omit<PrismaGame, 'createdAt'> {
    return {
      id: entity.identification.id,
      teamAId: entity.teamAId.id,
      teamBId: entity.teamBId.id,
      competitionId: entity.competitionId.id,
      scheduledAt: entity.schedule.value ?? null,
      isTBD: entity.schedule.isTBD,
      status: entity.status,
      updatedAt: entity.updatedAt,
    };
  }
}
