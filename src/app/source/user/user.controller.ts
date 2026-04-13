import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  async findUserActived(): Promise<CreateUserDTO[]> {
    return this.userService.findUsersActived();
  }
}
