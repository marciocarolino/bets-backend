import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user/IUser-repository';
import { UserEntity } from '../../domain/entities/user/user.entity';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PrismaUserMapper } from '../mapper/prisma-userMapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserEntity[]> {
    const data = await this.prisma.user.findMany({
      where: { active: true },
    });
    return PrismaUserMapper.toDomainList(data);
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    const newData = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!newData) {
      return null;
    }

    return PrismaUserMapper.toDomain(newData);
  }
  save(user: UserEntity): Promise<UserEntity> {
    console.log(user);
    throw new Error('Method not implemented.');
  }
}
