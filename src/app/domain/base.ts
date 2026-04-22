import { UUID } from 'crypto';

export class Identification {
  id: UUID;

  constructor(id?: UUID) {
    this.id = id || crypto.randomUUID();
  }
}

export abstract class ValueObject<T extends object> {
  protected readonly props: Readonly<T>;

  constructor(props: T) {
    this.props = Object.freeze({ ...props });
  }

  public equals(other?: ValueObject<T>): boolean {
    if (other == null) return false;
    if (other.constructor !== this.constructor) return false;
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}

export abstract class Entity {
  public readonly identification: Identification;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(
    identification: Identification,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.identification = identification;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  protected markAsUpdated() {
    this.updatedAt = new Date();
  }

  public equals(other: Entity): boolean {
    if (this.constructor !== other.constructor) return false;
    return this.identification.id === other.identification.id;
  }
}

export abstract class AggregateRoot extends Entity {}
