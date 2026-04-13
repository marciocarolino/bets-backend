import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findUserActived(): Promise<CreateUserDTO[]> {
    return this.userService.findUsersActived();
  }
}
