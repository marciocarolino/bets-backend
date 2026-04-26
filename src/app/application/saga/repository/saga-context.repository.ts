import { IRepository } from "../../../domain/repositories/base.repository";
import {
  SagaContext,
  SagaContextStatus,
} from "../saga-context/saga-context.entity";

export interface Criteria {
  sagaName?: string;
  externalId?: string;
  rawDataHash?: string;
  status?: SagaContextStatus;
}

export interface ISagaContextRepository extends IRepository<SagaContext> {
  findBy(criteria?: Criteria): Promise<SagaContext[]>;
}
