import { IRepository } from '../base.repository';
import { Team } from '../../entities/team/team.entity';

export interface TeamCriteria {
  name?: string;
  alias?: string;
}

export interface ITeamRepository extends IRepository<Team> {
  findBy(criteria?: TeamCriteria): Promise<Team[]>;
}
