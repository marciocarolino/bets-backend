import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";

import { PrismaModule } from "../prisma/prisma.module";
import {
  COMMAND_PUBLISHER,
  EVENT_PUBLISHER,
} from "./app/application/publisher/publisher.interface";
import { CompetitionCommandHandler } from "./app/application/saga/handlers/competition.command-handler";
import { OrchestratorListener } from "./app/application/saga/listener/orchestrator.listener";
import { GameImportOrchestrator } from "./app/application/saga/orchestrators/game-import.orchestrator";
import { SAGA_CONTEXT_REPOSITORY_TOKEN } from "./app/application/saga/repository/saga-context-repository.token";
import { CompetitionCreateUsecase } from "./app/application/services/competitions/create.usecase";
import { IngestSagaStartUsecase } from "./app/application/services/saga/ingest/ingest.usecase";
import { COMPETITION_REPOSITORY } from "./app/domain/repositories/competition/competition.repository";
import { PrismaCompetitionRepository } from "./app/infrastructure/competition/prisma-competitionRepository";
import {
  NestCommandPublisher,
  NestEventPublisher,
} from "./app/infrastructure/publisher/nestjs-publisher";
import { PrismaSagaContextRepository } from "./app/infrastructure/saga-context/prisma-sagaContextRepository";
import { IngestController } from "./app/interface/controllers/ingest/ingest.controller";
import { OutboxModule } from "./app/modules/outbox/outbox.module";
import { UserModule } from "./app/modules/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    UserModule,
    OutboxModule,
  ],
  controllers: [IngestController],
  providers: [
    GameImportOrchestrator,
    OrchestratorListener,
    IngestSagaStartUsecase,
    {
      provide: SAGA_CONTEXT_REPOSITORY_TOKEN,
      useClass: PrismaSagaContextRepository,
    },
    {
      provide: COMMAND_PUBLISHER,
      useClass: NestCommandPublisher,
    },
    {
      provide: EVENT_PUBLISHER,
      useClass: NestEventPublisher,
    },
    CompetitionCommandHandler,
    CompetitionCreateUsecase,
    {
      provide: COMPETITION_REPOSITORY,
      useClass: PrismaCompetitionRepository,
    },
  ],
})
export class AppModule {}
