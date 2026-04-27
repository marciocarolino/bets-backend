import { Team } from "../../entities/team/team.entity";
import { IRepository } from "../base.repository";

export interface TeamCriteria {
  name?: string;
  alias?: string;
}

export interface ITeamRepository extends IRepository<Team> {
  findBy(criteria?: TeamCriteria): Promise<Team[]>;
}
