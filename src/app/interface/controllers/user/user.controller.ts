import { Body, Controller, Get, Param, Post } from '@nestjs/common';
// import { UpdateUserDTO } from './dto/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../../../application/services/user/user.service';
import { UserResponse } from '../../../response/user/user-response.dto';
import { UserMapper } from '../../../application/mapper/user/user.mapper';
import { CreateUserDTO } from '../../../dto/user/create-user.dto';
import { CreateUserInput } from '../../../application/users/dto-or-input/create-user.input';
import { CreateUserMapper } from '../../../application/mapper/user/create-user.mapper';

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

  @Get(':email')
  @ApiResponse({ status: 200, description: 'user found successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async listUser(@Param('email') email: string): Promise<UserResponse | null> {
    const result = await this.userService.findByEmail(email);

    return UserMapper.toUserResponse(result);
  }

  @Post('/create-user')
  @ApiResponse({ status: 201, description: 'User created successfully ' })
  @ApiResponse({ status: 409, description: 'User already registered ' })
  async createUser(@Body() user: CreateUserDTO): Promise<UserResponse> {
    /*Converter o DTO para o input
    fazendo com que a service não receba DTO/Swagger nem Validate
    um tradutor fino entre HTTP e Application
    */
    const createUserInput = CreateUserMapper.toInput(user);
    const saveUser = await this.userService.save(createUserInput);
    return UserMapper.toUserResponse(saveUser);
  }

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
