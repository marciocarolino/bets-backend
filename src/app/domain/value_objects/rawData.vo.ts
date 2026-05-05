import { ValueObject } from "../base";

export class RawData extends ValueObject<Record<string, unknown>> {
  constructor(props: Record<string, unknown>) {
    super(props);
  }

  public get value(): Record<string, unknown> {
    return { ...this.props };
  }

  public get hashCode(): string {
    return JSON.stringify(this.props);
  }
}
