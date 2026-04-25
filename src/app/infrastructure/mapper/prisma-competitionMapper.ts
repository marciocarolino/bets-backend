import type { competition as PrismaCompetition } from '@prisma/client';
import type { UUID } from 'crypto';

import { Identification } from '../../domain/base';
import { Competition } from '../../domain/entities/competition/competition.entity';

export class PrismaCompetitionMapper {
  static toDomain(data: PrismaCompetition): Competition {
    return new Competition(
      new Identification(data.id as UUID),
      data.name,
      data.slug,
      data.season,
      data.country,
      data.createdAt,
      data.updatedAt,
    );
  }

  static toPrisma(entity: Competition): Omit<PrismaCompetition, 'createdAt'> {
    return {
      id: entity.identification.id,
      name: entity.name,
      slug: entity.slug,
      country: entity.country,
      season: entity.season,
      updatedAt: entity.updatedAt,
    };
  }
}
