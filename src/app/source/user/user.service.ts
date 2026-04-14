import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { ExceptionUtils } from '../../utils/exception.utils';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUsersActived(): Promise<CreateUserDTO[]> {
    return this.prisma.user.findMany({ where: { actived: true } });
  }

  async createUser(user: CreateUserDTO): Promise<CreateUserDTO> {
    const validateUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (validateUser) {
      throw new ExceptionUtils('User already exists', HttpStatus.CONFLICT);
    }

    const createUser = {
      ...user,
    };

    const saveUser = await this.prisma.user.create({
      data: { ...createUser, createdAt: new Date(), updatedAt: new Date() },
    });

    return saveUser;
  }

  async updateUser(userUpdate: UpdateUserDTO): Promise<UpdateUserDTO> {
    if (!userUpdate.email) {
      throw new ExceptionUtils('User not found!', HttpStatus.NOT_FOUND);
    }

    const email = userUpdate.email;

    const validateUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!validateUser) {
      throw new ExceptionUtils('User not found!', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.update({
      where: { email: email },
      data: {
        ...userUpdate,
      },
    });

    return { ...userUpdate };
  }

  async disableUser(email: string): Promise<boolean> {
    const validateUser = await this.prisma.user.findUnique({
      where: { email: email, actived: true },
    });

    if (validateUser?.actived != true) {
      throw new ExceptionUtils('User already disabled', HttpStatus.CONFLICT);
    }

    await this.prisma.user.update({
      where: { email: email },
      data: { actived: false, updatedAt: new Date() },
    });

    return true;
  }
}
