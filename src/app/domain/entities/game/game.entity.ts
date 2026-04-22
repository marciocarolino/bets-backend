import { AggregateRoot, Identification } from '../../base';
import { MatchSchedule } from '../../value_objects/matchSchedule.vo';

export enum GameStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  SUSPENDED = 'SUSPENDED',
  FINISHED = 'FINISHED',
  UNDEFINED = 'UNDEFINED',
}

export class Game extends AggregateRoot {
  public teamAId: Identification;
  public teamBId: Identification;

  private _schedule: MatchSchedule;
  private _status: GameStatus;

  constructor(
    identification: Identification,
    teamAId: Identification,
    teamBId: Identification,
    schedule: MatchSchedule,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(identification, createdAt, updatedAt);
    this.teamAId = teamAId;
    this.teamBId = teamBId;
    this._schedule = schedule;
  }

  get schedule(): MatchSchedule {
    return this._schedule;
  }

  get status(): GameStatus {
    if (this._status === GameStatus.FINISHED) return GameStatus.FINISHED;
    if (this._schedule.isTBD) return GameStatus.UNDEFINED;
    if (!this._schedule.value) return GameStatus.UNDEFINED;
    if (this._schedule.value > new Date()) return GameStatus.SCHEDULED;
    return GameStatus.IN_PROGRESS;
  }

  public finish(): void {
    if (this._status === GameStatus.FINISHED) {
      //TODO : Criar uma exception personalizada para isso
      throw new Error('Game is already finished.');
    }
    this._status = GameStatus.FINISHED;
    this.markAsUpdated();
  }

  public updateSchedule(newSchedule: MatchSchedule): void {
    if (this._status === GameStatus.FINISHED) {
      //TODO : Criar uma exception personalizada para isso
      throw new Error('Cannot update schedule of a finished game.');
    }
    this._schedule = newSchedule;
    this.markAsUpdated();
  }

  public static create(teamAId: Identification, teamBId: Identification): Game {
    const identification = new Identification();
    const createdAt = new Date();
    const updatedAt = new Date();
    const schedule = MatchSchedule.createTBD();
    return new Game(
      identification,
      teamAId,
      teamBId,
      schedule,
      createdAt,
      updatedAt,
    );
  }
}
