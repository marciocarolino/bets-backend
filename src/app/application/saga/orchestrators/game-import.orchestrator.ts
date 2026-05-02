import { Injectable } from "@nestjs/common";

import { BaseOrchestrator, SagaStepDefinition } from "./base.orchestrator";

@Injectable()
export class GameImportOrchestrator extends BaseOrchestrator {
  public readonly sagaName = "GameImportSaga";
  public readonly startEvent = "game-import.started";
  public readonly steps: SagaStepDefinition[] = [
    {
      name: "CompetitionImportStep",
      commandName: "cmd.competition.create",
      eventName: "evt.competition",
      successEvent: "competition.created",
      failureEvent: "competition.create.failed",
      targetAggregateType: "Competition",
    },
  ];
}
