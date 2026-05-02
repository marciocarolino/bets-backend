import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import type { DomainEvent } from "../../../domain/repositories/base.repository";
import { GameImportOrchestrator } from "../orchestrators/game-import.orchestrator";

@Injectable()
export class OrchestratorListener {
  constructor(
    private readonly gameImportOrchestrator: GameImportOrchestrator,
  ) {}

  @OnEvent("evt.**")
  async handle(event: DomainEvent): Promise<void> {
    if (this.gameImportOrchestrator.canHandle(event)) {
      await this.gameImportOrchestrator.dispatch(event);
    }
  }
}
