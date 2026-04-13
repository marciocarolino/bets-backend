import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';

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
      throw new Error('User already exists');
    }

    const createUser = {
      ...user,
    };

    const saveUser = await this.prisma.user.create({ data: { ...createUser } });

    return saveUser;
  }
}
