import { ValueObject } from '../base';

interface MatchScheduleProps {
  dateTime?: Date;
  isTBD?: boolean;
}

export class MatchSchedule extends ValueObject<MatchScheduleProps> {
  private constructor(props: MatchScheduleProps) {
    super(props);
  }

  public static create(dateTime: Date): MatchSchedule {
    if (dateTime < new Date()) {
      //TODO : Criar uma exception personalizada para isso
      throw new Error(
        'Not possible to create a match schedule with a past date and time.',
      );
    }
    return new MatchSchedule({ dateTime, isTBD: false });
  }

  public static createTBD(): MatchSchedule {
    if (this.prototype.props.dateTime) {
      //TODO : Criar uma exception personalizada para isso
      throw new Error(
        'Not possible to create a match schedule as TBD if it already has a date and time.',
      );
    }
    return new MatchSchedule({ isTBD: true });
  }

  get value(): Date | null {
    return this.props.dateTime || null;
  }

  get isTBD(): boolean {
    return Boolean(this.props.isTBD);
  }
}
