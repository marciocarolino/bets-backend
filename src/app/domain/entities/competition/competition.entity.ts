import { AggregateRoot, Identification } from "../../base";

export class Competition extends AggregateRoot {
  public readonly slug: string;
  private _name: string;
  private _country: string;
  private _season: string;

  constructor(
    identification: Identification,
    name: string,
    slug: string,
    season: string,
    country: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(identification, createdAt, updatedAt);
    this._name = name;
    this.slug = slug;
    this._country = country;
    this._season = season;
  }

  get name(): string {
    return this._name;
  }

  get country(): string {
    return this._country;
  }

  get season(): string {
    return this._season;
  }

  public rename(newName: string): void {
    this._name = newName;
    this.markAsUpdated();
  }

  public static create(
    name: string,
    slug: string,
    country: string,
    season: string,
  ): Competition {
    return new Competition(
      new Identification(),
      name,
      slug,
      season,
      country,
      new Date(),
      new Date(),
    );
  }
}
