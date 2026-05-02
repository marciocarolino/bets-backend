import { Inject, Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import {
  type IOutboxMessageRepository,
  OUTBOX_MESSAGE_REPOSITORY,
} from "../../../infrastructure/outbox/outbox.repository";
import { OutboxMessage } from "../../../infrastructure/outbox/outbox-message/outbox-message.entity";
import { CompetitionCreateUsecase } from "../../services/competitions/create.usecase";
import type { DomainCommand } from "../commands/domain-command";

interface CompetitionCreatePayload {
  name: string;
  slug: string;
  country: string;
  season: string;
}

@Injectable()
export class CompetitionCommandHandler {
  private readonly logger = new Logger(CompetitionCommandHandler.name);

  constructor(
    private readonly competitionCreateUsecase: CompetitionCreateUsecase,
    @Inject(OUTBOX_MESSAGE_REPOSITORY)
    private readonly outboxRepo: IOutboxMessageRepository,
  ) {}

  @OnEvent("cmd.competition.create")
  async handle(
    command: DomainCommand<CompetitionCreatePayload>,
  ): Promise<void> {
    try {
      await this.competitionCreateUsecase.execute({
        ...command.payload,
        correlationId: command.correlationId,
      });

      this.logger.log(
        `Competition created successfully for saga ${command.correlationId}`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(
        `Failed to create competition for saga ${command.correlationId}: ${message}`,
      );
      const failureEvent = OutboxMessage.create(
        "Competition",
        command.correlationId,
        "competition.create.failed",
        { error: message },
      );

      await this.outboxRepo.save(failureEvent);
    }
  }
}
