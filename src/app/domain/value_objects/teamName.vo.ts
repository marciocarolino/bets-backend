import { ValueObject } from "../base";

interface TeamNameProps {
  name: string;
  alias: string;
}

export class TeamName extends ValueObject<TeamNameProps> {
  private constructor(props: TeamNameProps) {
    super(props);
  }

  public static create(name: string, alias: string): TeamName {
    if (!name || name.trim().length === 0) {
      //TODO : Criar uma exception personalizada para isso
      throw new Error("Team name cannot be empty.");
    }
    if (!alias || alias.trim().length === 0) {
      //TODO : Criar uma exception personalizada para isso
      throw new Error("Team alias cannot be empty.");
    }
    return new TeamName({ name: name.trim(), alias: alias.trim() });
  }

  get name(): string {
    return this.props.name;
  }

  get alias(): string {
    return this.props.alias;
  }
}
