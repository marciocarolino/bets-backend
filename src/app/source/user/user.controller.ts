import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findUserActived(): Promise<CreateUserDTO[]> {
    return this.userService.findUsersActived();
  }

  @Post('/create-user')
  async createUser(@Body() user: CreateUserDTO): Promise<CreateUserDTO> {
    return this.userService.createUser(user);
  }
}
