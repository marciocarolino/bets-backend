import { Entity } from "../base";

export interface DomainEvent {
  readonly eventType: string;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly payload: Record<string, unknown>;
}

export interface IRepository<T extends Entity, ID = string> {
  //When implement this interface, you can specify the type of criteria that will be used to filter
  // the entities. For example, you can create a GameCriteria interface that has properties
  // like teamAId, teamBId, status, etc. Then, you can use this criteria to implement the findBy
  // method in the GameRepository.
  findBy(criteria?: any): Promise<T[]>;

  retrieve(id: ID): Promise<T | null>;

  save(entity: T, events?: DomainEvent[]): Promise<T>;

  delete(id: ID): Promise<void>;
}
