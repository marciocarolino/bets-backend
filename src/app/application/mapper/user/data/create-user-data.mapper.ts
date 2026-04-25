import { CreateUserData } from '../../../../domain/repositories/user/Icreate-user.data';
import { CreateUserInput } from '../../../users/dto-or-input/create-user.input';

export class CreateUserDataMapper {
  static toDomainData(
    input: CreateUserInput,
    passwordHash: string,
  ): CreateUserData {
    return {
      name: input.name,
      email: input.email,
      passwordHash: passwordHash,
    };
  }
}
