import { Inject, Injectable } from "@nestjs/common";

import { Competition } from "../../../domain/entities/competition/competition.entity";
import { DomainEvent } from "../../../domain/repositories/base.repository";
import type { ICompetitionRepository } from "../../../domain/repositories/competition/competition.repository";
import { COMPETITION_REPOSITORY } from "../../../domain/repositories/competition/competition.repository";
import { Usecase } from "../base.usecase";

export interface Input {
  name: string;
  slug: string;
  country: string;
  season: string;
}

export interface Output {
  id: string;
}

@Injectable()
export class CompetitionCreateUsecase implements Usecase<Input, Output> {
  constructor(
    @Inject(COMPETITION_REPOSITORY)
    private readonly competitionRepository: ICompetitionRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const existing = await this.competitionRepository.findBy({
      slug: input.slug,
      season: input.season,
    });
    if (existing) return { id: existing[0].identification.id };

    const competition = Competition.create(
      input.name,
      input.slug,
      input.country,
      input.season,
    );

    //TODO: Criar os evento dentro do agregado
    const event: DomainEvent = {
      eventType: "competition.created",
      aggregateType: "Competition",
      aggregateId: competition.identification.id,
      payload: {
        name: competition.name,
        slug: competition.slug,
        country: competition.country,
        season: competition.season,
      },
    };

    const saved = await this.competitionRepository.save(competition, [event]);
    return { id: saved.identification.id };
  }
}
