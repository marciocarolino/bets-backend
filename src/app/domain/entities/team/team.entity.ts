import { AggregateRoot, Identification } from "../../base";
import { TeamName } from "../../value_objects/teamName.vo";

export class Team extends AggregateRoot {
  private _teamName: TeamName;

  constructor(
    identification: Identification,
    teamName: TeamName,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(identification, createdAt, updatedAt);
    this._teamName = teamName;
  }

  get teamName(): TeamName {
    return this._teamName;
  }

  public updateName(newName: string, newAlias: string): void {
    this._teamName = TeamName.create(newName, newAlias);
    this.markAsUpdated();
  }

  public static create(name: string, alias: string): Team {
    return new Team(
      new Identification(),
      TeamName.create(name, alias),
      new Date(),
      new Date(),
    );
  }
}
