import type { Team as PrismaTeam } from "@prisma/client";
import type { UUID } from "crypto";

import { Identification } from "../../domain/base";
import { Team } from "../../domain/entities/team/team.entity";
import { TeamName } from "../../domain/value_objects/teamName.vo";

export class PrismaTeamMapper {
  static toDomain(data: PrismaTeam): Team {
    return new Team(
      new Identification(data.id as UUID),
      TeamName.create(data.name, data.alias),
      data.createdAt,
      data.updatedAt,
    );
  }

  static toPrisma(entity: Team): Omit<PrismaTeam, "createdAt"> {
    return {
      id: entity.identification.id,
      name: entity.teamName.name,
      alias: entity.teamName.alias,
      updatedAt: entity.updatedAt,
    };
  }
}
