
import { UpdateUserDTO } from '../../dto/user/update-user.dto';
import { UpdateUserInput } from '../../users/dto-or-input/update-user.input';

export class UpdateUserDataMapper {
  static toInput(dto: UpdateUserDTO): UpdateUserInput {
    const input = new UpdateUserInput();

    input.name = dto.name;
    input.email = dto.email;
    input.password = dto.password;


    return input;
  }
}
