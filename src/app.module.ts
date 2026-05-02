import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";

import { PrismaModule } from "../prisma/prisma.module";
import {
  COMMAND_PUBLISHER,
  EVENT_PUBLISHER,
} from "./app/application/publisher/publisher.interface";
import { OrchestratorListener } from "./app/application/saga/listener/orchestrator.listener";
import { GameImportOrchestrator } from "./app/application/saga/orchestrators/game-import.orchestrator";
import { SAGA_CONTEXT_REPOSITORY_TOKEN } from "./app/application/saga/repository/saga-context-repository.token";
import { IngestSagaStartUsecase } from "./app/application/services/saga/ingest/ingest.usecase";
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
  ],
})
export class AppModule {}
