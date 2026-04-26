import { IFindUserEmailData } from '../../../../domain/repositories/user/Ifind-user-email.data';
import { UserEmailInput } from '../../../users/dto-or-input/user-email-input';

export class FindUserDataMapper {
  static toDomainData(input: UserEmailInput): IFindUserEmailData {
    return {
      email: input.email,
    };
  }
}
