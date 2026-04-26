import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../../../application/services/user/user.service';

import { UserMapper } from '../../../application/mapper/user/user.mapper';

import { CreateUserMapper } from '../../../application/mapper/user/create-user.mapper';
import { UserEmailDataMapper } from '../../../application/mapper/user/user-email.mapper';

import { CreateUserDTO } from '../../../application/dto/user/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserEmailDTO } from '../../../application/dto/user/user-email.dto';

import { UserResponse } from '../../../response/user/user-response.dto';
import { UserUpdateResponse } from '../../../response/user/user-update-response.dto';
import { UpdateUserDataMapper } from '../../../application/mapper/user/update-user-.mapper';


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

  @Get('/:email')
  @ApiResponse({ status: 200, description: 'user found successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async listUser(@Param() email: UserEmailDTO): Promise<UserResponse> {
    const emailInput = UserEmailDataMapper.toInput(email);

    const findEmail = await this.userService.findByEmail(emailInput);

    return UserMapper.toUserResponse(findEmail);
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
    const saveUser = await this.userService.create(createUserInput);
    return UserMapper.toUserResponse(saveUser);
  }

   @Patch('/update-user')
   @ApiResponse({ status: 201, description: 'User updated successfully ' })
   async updateUser(@Body() user: UpdateUserDTO): Promise<UserUpdateResponse> {
    
    const userUpdateInput = UpdateUserDataMapper.toInput(user);
    
    const update = await this.userService.update(userUpdateInput);

    return UserMapper.toUpdateUserResponse(update)
   }

  // @Delete('/delete-user')
  // @ApiResponse({ status: 200, description: 'User deleted successfully ' })
  // async disableUser(@Body() email: string): Promise<boolean> {
  //   return this.userService.disableUser(email);
  // }
}
