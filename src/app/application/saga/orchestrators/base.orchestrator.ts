import { Inject, Logger } from "@nestjs/common";

import { DomainEvent } from "../../../domain/repositories/base.repository";
import type { CommandPublisher } from "../../publisher/publisher.interface";
import { COMMAND_PUBLISHER } from "../../publisher/publisher.interface";
import type { ISagaContextRepository } from "../repository/saga-context.repository";
import { SAGA_CONTEXT_REPOSITORY_TOKEN } from "../repository/saga-context-repository.token";
import {
  SagaContext as SagaContextEntity,
  SagaContextStatus,
} from "../saga-context/saga-context.entity";

export type { DomainCommand } from "../commands/domain-command";

export interface SagaStepContext {
  saga: SagaContextEntity;
  event: DomainEvent;
  commandName: string;
  payload: unknown;
  processData: Record<string, unknown>;
}

export interface SagaStepDefinition {
  name: string;
  commandName: string;
  eventName: string;
  successEvent: string;
  failureEvent: string;
  targetAggregateType?: string;

  buildCommandPayload?: (ctx: SagaStepContext) => Record<string, unknown>;
  compensate?: (ctx: SagaStepContext) => Promise<void>;
}

export abstract class BaseOrchestrator {
  protected readonly logger = new Logger(this.constructor.name);

  public abstract readonly sagaName: string;
  public abstract readonly startEvent: string;
  public abstract readonly steps: SagaStepDefinition[];

  private static readonly NON_DISPATCHABLE_STATUSES = new Set([
    SagaContextStatus.COMPLETED,
    SagaContextStatus.FAILED,
  ]);

  constructor(
    @Inject(SAGA_CONTEXT_REPOSITORY_TOKEN)
    private readonly sagaContextRepo: ISagaContextRepository,
    @Inject(COMMAND_PUBLISHER)
    private readonly commandPublisher: CommandPublisher,
  ) {}

  public isStartEvent(event: DomainEvent): boolean {
    return event.eventType === this.startEvent;
  }

  public canHandle(event: DomainEvent): boolean {
    return (
      this.isStartEvent(event) ||
      this.steps.some((step) =>
        [step.successEvent, step.failureEvent].includes(event.eventType),
      )
    );
  }

  public async dispatch(event: DomainEvent): Promise<boolean> {
    const saga = await this.getSagaByCorrelationId(event.correlationId);

    if (!saga || !this.canDispatchStatus(saga.status)) {
      return false;
    }

    if (saga.status === SagaContextStatus.PENDING && this.isStartEvent(event)) {
      return this.handleStart(saga, event);
    }

    if (saga.status !== SagaContextStatus.RUNNING) {
      this.logger.warn(
        `Saga ${saga.identification.id} in status ${saga.status} cannot process event "${event.eventType}"`,
      );
      return false;
    }

    const step = this.steps[saga.currentStep];

    if (!step) {
      this.logger.warn(
        `Saga ${saga.identification.id} has invalid currentStep ${saga.currentStep}`,
      );
      return false;
    }

    if (event.eventType === step.successEvent) {
      return this.handleStepSuccess(saga, step, event);
    }

    if (event.eventType === step.failureEvent) {
      return this.handleStepFailure(saga, step, event);
    }

    return false;
  }

  private async handleStart(
    saga: SagaContextEntity,
    event: DomainEvent,
  ): Promise<boolean> {
    const firstStep = this.steps[saga.currentStep];

    if (!firstStep) {
      this.logger.error(`Saga "${this.sagaName}" has no steps configured`);
      return false;
    }

    saga.markRunning();
    const saved = await this.sagaContextRepo.save(saga);

    await this.dispatchStepCommand(saved, firstStep, event);

    this.logger.log(
      `Saga ${saved.identification.id} started — dispatching step "${firstStep.name}"`,
    );

    return true;
  }

  private async getSagaByCorrelationId(
    correlationId: string,
  ): Promise<SagaContextEntity | null> {
    const sagas = await this.sagaContextRepo.findBy({ correlationId });

    if (sagas.length === 0) {
      this.logger.warn(
        `Saga with correlation ID ${correlationId} not found, skipping`,
      );
      return null;
    }

    return sagas[0];
  }

  private canDispatchStatus(status: SagaContextStatus): boolean {
    if (BaseOrchestrator.NON_DISPATCHABLE_STATUSES.has(status)) {
      this.logger.warn(`Saga with status ${status} cannot be dispatched`);
      return false;
    }

    return true;
  }

  private async handleStepSuccess(
    saga: SagaContextEntity,
    step: SagaStepDefinition,
    event: DomainEvent,
  ): Promise<boolean> {
    saga.advanceStep(step.name, {
      successEvent: event.eventType,
      payload: event.payload,
    });

    if (saga.currentStep >= this.steps.length) {
      saga.markCompleted();
      await this.sagaContextRepo.save(saga);
      this.logger.log(`Saga ${saga.identification.id} completed`);
      return true;
    }

    const saved = await this.sagaContextRepo.save(saga);

    const nextStep = this.steps[saved.currentStep];

    if (!nextStep) {
      this.logger.error(
        `Saga "${this.sagaName}" has invalid next step: ${saved.currentStep}`,
      );
      return false;
    }

    await this.dispatchStepCommand(saved, nextStep, event);

    return true;
  }

  private async handleStepFailure(
    saga: SagaContextEntity,
    step: SagaStepDefinition,
    event: DomainEvent,
  ): Promise<boolean> {
    saga.markFailed(
      `Step "${step.name}" failed with event "${event.eventType}"`,
    );

    await this.sagaContextRepo.save(saga);

    this.logger.warn(
      `Saga ${saga.identification.id} failed at step "${step.name}"`,
    );

    return true;
  }

  private async dispatchStepCommand(
    saga: SagaContextEntity,
    step: SagaStepDefinition,
    event: DomainEvent,
  ): Promise<void> {
    const ctx: SagaStepContext = {
      saga,
      event,
      commandName: step.commandName,
      payload: event.payload,
      processData: saga.processData,
    };

    await this.commandPublisher.publish({
      commandName: step.commandName,
      correlationId: saga.correlationIdValue,

      targetAggregateType: step.targetAggregateType ?? "SagaOrchestrator",
      targetAggregateId: saga.identification.id,

      source: this.sagaName,
      payload: step.buildCommandPayload?.(ctx) ?? event.payload,

      metadata: {
        sagaId: saga.identification.id,
        sagaName: this.sagaName,
        stepName: step.name,
        currentStep: saga.currentStep,
        sourceEvent: event.eventType,
      },
    });
  }
}
