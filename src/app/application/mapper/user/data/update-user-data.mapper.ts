import { UpdateUserData } from '../../../../domain/repositories/user/update-user.data';
import { UpdateUserInput } from '../../../users/dto-or-input/update-user.input';

export class UpdateUserDataMapper {
  static toDomainData(input: UpdateUserInput): UpdateUserData {
    return {
      email: input.email,
    };
  }
}
