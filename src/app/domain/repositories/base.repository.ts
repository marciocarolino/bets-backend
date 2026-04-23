import { Entity } from '../base';

export interface IRepository<T extends Entity, ID = string> {
  findBy(criteria?: Partial<T>): Promise<T[]>;

  retrieve(id: ID): Promise<T | null>;

  save(entity: T): Promise<T>;

  delete(id: ID): Promise<void>;
}
