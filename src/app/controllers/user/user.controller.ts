import { Body, Controller, Get } from '@nestjs/common';
// import { UpdateUserDTO } from './dto/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponse } from '../../response/user/user-response.dto';
import { UserService } from '../../application/services/user/user.service';
import { UserMapper } from '../../application/mapper/user/user.mapper';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'user found successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findUserActived(): Promise<UserResponse[]> {
    const resultt = await this.userService.findAll();
    return UserMapper.toUserResponseList(resultt);
  }

  // @Get(':email')
  // @ApiResponse({ status: 200, description: 'user found successfully' })
  // @ApiResponse({ status: 404, description: 'User not found' })
  // async listUser(@Param('email') email: string): Promise<UserResponse | null> {
  //   return await this.userService.findUserByEmail(email);
  // }

  // @Post('/create-user')
  // @ApiResponse({ status: 201, description: 'User created successfully ' })
  // @ApiResponse({ status: 409, description: 'User already registered ' })
  // async createUser(@Body() user: CreateUserDTO): Promise<CreateUserDTO> {
  //   return await this.userService.createUser(user);
  // }

  // @Patch('/update-user')
  // @ApiResponse({ status: 201, description: 'User updated successfully ' })
  // async updateUser(@Body() user: UpdateUserDTO): Promise<UpdateUserDTO> {
  //   return this.userService.updateUser(user);
  // }

  // @Delete('/delete-user')
  // @ApiResponse({ status: 200, description: 'User deleted successfully ' })
  // async disableUser(@Body() email: string): Promise<boolean> {
  //   return this.userService.disableUser(email);
  // }
}
