import { UserEmailDTO } from '../../dto/user/user-email.dto';
import { UserEmailInput } from '../../users/dto-or-input/user-email-input';

export class UserEmailDataMapper {
  static toInput(dto: UserEmailDTO): UserEmailInput {
    const input = new UserEmailInput();

    input.email = dto.email;

    return input;
  }
}
