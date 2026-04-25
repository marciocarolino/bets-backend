import { IFindUserEmailData } from '../../../../domain/repositories/user/Ifind-user-email.data';
import { FindUserEmailInput } from '../../../users/dto-or-input/find-user-email-input';

export class FindUserDataMapper {
  static toDomainData(input: FindUserEmailInput): IFindUserEmailData {
    return {
      email: input.email,
    };
  }
}
