import { IRepository } from '../base.repository';
import { Competition } from '../../entities/competition/competition.entity';

export interface CompetitionCriteria {
  name?: string;
  slug?: string;
  country?: string;
  season?: string;
}

export interface ICompetitionRepository extends IRepository<Competition> {
  findBy(criteria?: CompetitionCriteria): Promise<Competition[]>;
}
