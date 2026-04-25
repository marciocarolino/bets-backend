import type { Game as PrismaGame } from '@prisma/client';
import type { UUID } from 'crypto';

import { Identification } from '../../domain/base';
import { Game } from '../../domain/entities/game/game.entity';
import { MatchSchedule } from '../../domain/value_objects/matchSchedule.vo';

export class PrismaGameMapper {
  static toDomain(data: PrismaGame): Game {
    const schedule = data.isTBD
      ? MatchSchedule.createTBD()
      : MatchSchedule.create(data.scheduledAt as Date);

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
