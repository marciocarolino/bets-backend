import { AggregateRoot, Identification } from "../../../domain/base";

export enum SagaContextStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  COMPENSATING = "COMPENSATING",
  COMPENSATED = "COMPENSATED",
}

export interface SagaContextProps {
  sagaName: string;
  externalId?: string;
  rawDataHash: string;
  status: SagaContextStatus;
  currentStep: number;
  rawData: Record<string, unknown>;
  processData: Record<string, unknown>;
  logs: string[];
  error: string | null;
  retryCount: number;
  version: number;
}

export class SagaContext extends AggregateRoot {
  private _sagaName: string;
  private _externalId: string | null;
  private _rawDataHash: string;
  private _status: SagaContextStatus;
  private _currentStep: number;
  private readonly _rawData: Readonly<Record<string, unknown>>;
  private _processData: Record<string, unknown>;
  private _logs: string[];
  private _error: string | null;
  private _retryCount: number;
  private _version: number;

  constructor(
    identification: Identification,
    props: SagaContextProps,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(identification, createdAt, updatedAt);
    this._sagaName = props.sagaName;
    this._externalId = props.externalId ?? null;
    this._rawDataHash = props.rawDataHash;
    this._status = props.status;
    this._currentStep = props.currentStep;
    this._rawData = Object.freeze({ ...props.rawData });
    this._processData = { ...props.processData };
    this._logs = [...props.logs];
    this._error = props.error;
    this._retryCount = props.retryCount;
    this._version = props.version;
  }
  get sagaName(): string {
    return this._sagaName;
  }
  get externalId(): string | null {
    return this._externalId;
  }
  get rawDataHash(): string {
    return this._rawDataHash;
  }
  get status(): SagaContextStatus {
    return this._status;
  }
  get currentStep(): number {
    return this._currentStep;
  }
  get rawData(): Readonly<Record<string, unknown>> {
    return this._rawData;
  }
  get processData(): Record<string, unknown> {
    return { ...this._processData };
  }
  get logs(): readonly string[] {
    return [...this._logs];
  }
  get error(): string | null {
    return this._error;
  }
  get retryCount(): number {
    return this._retryCount;
  }
  get version(): number {
    return this._version;
  }

  public markRunning(): void {
    this._status = SagaContextStatus.RUNNING;
    this._error = null;
    this.markAsUpdated();
  }

  public advanceStep(
    stepName: string,
    stepResult: Record<string, unknown>,
  ): void {
    this._processData = { ...this._processData, ...stepResult };
    this._currentStep += 1;
    this._logs.push(
      `[${new Date().toISOString()}] Step "${stepName}" completed`,
    );
    this._version += 1;
    this.markAsUpdated();
  }

  public markCompleted(): void {
    this._status = SagaContextStatus.COMPLETED;
    this._logs.push(`[${new Date().toISOString()}] Saga completed`);
    this._version += 1;
    this.markAsUpdated();
  }

  public markFailed(error: string): void {
    this._status = SagaContextStatus.FAILED;
    this._error = error;
    this._retryCount += 1;
    this._logs.push(
      `[${new Date().toISOString()}] Failed at step ${this._currentStep}: ${error}`,
    );
    this._version += 1;
    this.markAsUpdated();
  }

  public canRetry(maxRetries: number): boolean {
    return this._retryCount < maxRetries;
  }

  public resumeForRetry(): void {
    this._status = SagaContextStatus.PENDING;
    this.markAsUpdated();
  }

  public markCompensating(): void {
    this._status = SagaContextStatus.COMPENSATING;
    this._logs.push(`[${new Date().toISOString()}] Compensation started`);
    this._version += 1;
    this.markAsUpdated();
  }

  public rewindStep(stepName: string): void {
    this._currentStep -= 1;
    this._logs.push(
      `[${new Date().toISOString()}] Step "${stepName}" compensated`,
    );
    this._version += 1;
    this.markAsUpdated();
  }

  public markCompensated(): void {
    this._status = SagaContextStatus.COMPENSATED;
    this._logs.push(`[${new Date().toISOString()}] Saga fully compensated`);
    this._version += 1;
    this.markAsUpdated();
  }

  public static create(
    sagaName: string,
    rawData: Record<string, unknown>,
    rawDataHash: string,
    externalId?: string,
  ): SagaContext {
    return new SagaContext(
      new Identification(),
      {
        sagaName,
        externalId,
        rawDataHash,
        status: SagaContextStatus.PENDING,
        currentStep: 0,
        rawData,
        processData: {},
        logs: [`[${new Date().toISOString()}] Saga context created`],
        error: null,
        retryCount: 0,
        version: 0,
      },
      new Date(),
      new Date(),
    );
  }
}
