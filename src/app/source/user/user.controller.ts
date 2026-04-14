import { Body, Controller, Get, Post, Patch, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findUserActived(): Promise<CreateUserDTO[]> {
    return this.userService.findUsersActived();
  }

  @Post('/create-user')
  @ApiResponse({ status: 201, description: 'User created successfully ' })
  @ApiResponse({ status: 409, description: 'User already registered ' })
  async createUser(@Body() user: CreateUserDTO): Promise<CreateUserDTO> {
    return this.userService.createUser(user);
  }

  @Patch('/update-user')
  async updateUser(@Body() user: UpdateUserDTO): Promise<UpdateUserDTO> {
    return this.userService.updateUser(user);
  }

  @Delete('/delete-user')
  async disableUser(@Body() email: string): Promise<boolean> {
    return this.userService.disableUser(email);
  }
}
