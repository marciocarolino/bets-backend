import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserEntity } from '../../entities/user/user.entity';
import { CreateUserDTO } from '../../dto/user/create-user.dto';
import { ForAuthUserDTO } from '../../dto/user/forAuth-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.prisma.user.findMany({
      where: { actived: true },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.prisma.user.findUnique({
      where: { actived: true, email: email },
    });
  }

  async findUserForAuth(email: string): Promise<ForAuthUserDTO | null> {
    return await this.prisma.user.findUnique({
      where: { actived: true, email: email },
      select: { email: true, password: true },
    });
  }

  async createUser(user: CreateUserDTO): Promise<UserEntity> {
    return await this.prisma.user.create({
      data: { ...user },
    });
  }
}
