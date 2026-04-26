import { Game } from "../../entities/game/game.entity";
import { IRepository } from "../base.repository";

export interface GameCriteria {
  teamAId?: string;
  teamBId?: string;
  status?: string;
}

export interface IGameRepository extends IRepository<Game> {
  findBy(criteria?: GameCriteria): Promise<Game[]>;
  findByTeam(teamId: string): Promise<Game[]>;
}
