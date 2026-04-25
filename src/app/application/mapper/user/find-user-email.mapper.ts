import { FindUserEmailDTO } from '../../dto/user/find-user-email.dto';
import { FindUserEmailInput } from '../../users/dto-or-input/find-user-email-input';

export class FindUserEmailDataMapper {
  static toInput(dto: FindUserEmailDTO): FindUserEmailInput {
    const input = new FindUserEmailInput();

    input.email = dto.email;

    return input;
  }
}
