import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionUtils } from '../../utils/exception.utils';
// import { UpdateUserDTO } from './dto/update-user.dto';
import { HashPassword } from '../../utils/hashPassword.utils';
import { isEmailValid } from '../../utils/validateEmail.utils';

// import { UserEntity } from '../../entities/user/user.entity';
// import { user as UserClient } from '@prisma/client';

import { UserRepository } from '../../repositories/user/user.repository';
import { UserResponse } from '../../response/user/user-response.dto';
import { UserMapper } from '../../mapper/user/user.mapper';
import { CreateUserDTO } from '../../dto/user/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUsersActived(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll();

    return UserMapper.toUserResponseList(users);
  }

  async findUserByEmail(email: string): Promise<UserResponse> {
    isEmailValid(email);

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new ExceptionUtils('User Not Found!', HttpStatus.NOT_FOUND);
    }

    return UserMapper.toUserResponse(user);
  }

  // async findUserForAuth(email: string):Promise<> {
  //   const validUser = await this.prisma.user.findUnique({
  //     where: { actived: true, email: email },
  //     select: { email: true, password: true },
  //   });

  //   if (!validUser) {
  //     throw new ExceptionUtils(
  //       'Email or password incorrect',
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }

  //   return validUser;
  // }

  async createUser(user: CreateUserDTO): Promise<CreateUserDTO> {
    const validateEmail = await this.userRepository.findByEmail(user.email);

    if (validateEmail) {
      throw new ExceptionUtils('User already exists', HttpStatus.CONFLICT);
    }

    user.password = await HashPassword(user.password);

    const createUser = {
      ...user,
    };

    const saveUser = await this.userRepository.createUser(createUser);

    return saveUser;
  }

  // async updateUser(userUpdate: UpdateUserDTO): Promise<UpdateUserDTO> {
  //   if (!userUpdate.email) {
  //     throw new ExceptionUtils('User not found!', HttpStatus.NOT_FOUND);
  //   }

  //   const email = userUpdate.email;

  //   const validateUser = await this.prisma.user.findUnique({
  //     where: { email: email },
  //   });

  //   if (!validateUser) {
  //     throw new ExceptionUtils('User not found!', HttpStatus.NOT_FOUND);
  //   }

  //   await this.prisma.user.update({
  //     where: { email: email },
  //     data: {
  //       ...userUpdate,
  //     },
  //   });

  //   return { ...userUpdate };
  // }

  // async disableUser(email: string): Promise<boolean> {
  //   const validateUser = await this.prisma.user.findUnique({
  //     where: { email: email, actived: true },
  //   });

  //   if (validateUser?.actived != true) {
  //     throw new ExceptionUtils('User already disabled', HttpStatus.CONFLICT);
  //   }

  //   await this.prisma.user.update({
  //     where: { email: email },
  //     data: { actived: false, updatedAt: new Date() },
  //   });

  //   return true;
  // }
}
