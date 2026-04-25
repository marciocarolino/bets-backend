import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user/IUser-repository';
import { UserEntity } from '../../domain/entities/user/user.entity';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PrismaUserMapper } from '../mapper/prisma-userMapper';
import { CreateUserData } from '../../domain/repositories/user/Icreate-user.data';
import { IFindUserEmailData } from '../../domain/repositories/user/Ifind-user-email.data';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserEntity[]> {
    const data = await this.prisma.user.findMany({
      where: { active: true },
    });
    return PrismaUserMapper.toDomainList(data);
  }
  async findByEmail(email: IFindUserEmailData): Promise<UserEntity | null> {
    const newData = await this.prisma.user.findUnique({
      where: { email: email.email },
    });

    if (!newData) {
      return null;
    }

    return PrismaUserMapper.toDomain(newData);
  }
  async create(user: CreateUserData): Promise<UserEntity> {
    const saveUser = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.passwordHash,
      },
    });
    return PrismaUserMapper.toDomain(saveUser);
  }
}
