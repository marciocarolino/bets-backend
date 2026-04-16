import { /*HttpStatus,*/ Injectable } from '@nestjs/common';
// import { CreateUserDTO } from './dto/create-user.dto';
// import { ExceptionUtils } from '../../utils/exception.utils';
// import { UpdateUserDTO } from './dto/update-user.dto';
// import { HashPassword } from '../../utils/hashPassword.utils';
// import { isEmailValid } from '../../utils/validateEmail.utils';

// import { UserEntity } from '../../entities/user/user.entity';
// import { user as UserClient } from '@prisma/client';

import { UserRepository } from '../../repositories/user/user.repository';
import { UserResponse } from '../../response/user/user-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUsersActived(): Promise<UserResponse[]> {
    const findUserRepository = await this.userRepository.findAll();

    const result = findUserRepository.map((r) => {
      return {
        name: r.name,
        email: r.email,
        actived: r.actived,
      };
    });

    return result;
  }

  // async findUsersEmail(email: string): Promise<string> {
  //   isEmailValid(email);

  //   const validateEmail = await this.prisma.user.findUnique({
  //     where: { actived: true, email: email },
  //     select: { email: true },
  //   });

  //   if (!validateEmail) {
  //     throw new ExceptionUtils('User Not Found!', HttpStatus.NOT_FOUND);
  //   }

  //   return validateEmail.email;
  // }

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

  // async createUser(user: CreateUserDTO): Promise<CreateUserDTO> {
  //   const validateUser = await this.prisma.user.findUnique({
  //     where: { email: user.email },
  //   });

  //   if (validateUser) {
  //     throw new ExceptionUtils('User already exists', HttpStatus.CONFLICT);
  //   }

  //   user.password = await HashPassword(user.password);

  //   const createUser = {
  //     ...user,
  //   };

  //   const saveUser = await this.prisma.user.create({
  //     data: { ...createUser, createdAt: new Date(), updatedAt: new Date() },
  //   });

  //   return saveUser;
  // }

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
