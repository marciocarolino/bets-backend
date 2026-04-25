/*
converter CreateUserDTO → CreateUserInput.
*/

import { CreateUserDTO } from '../../dto/user/create-user.dto';
import { CreateUserInput } from '../../users/dto-or-input/create-user.input';

export class CreateUserMapper {
  static toInput(dto: CreateUserDTO): CreateUserInput {
    const input = new CreateUserInput();

    input.email = dto.email;
    input.name = dto.name;
    input.password = dto.password;

    return input;
  }
}
