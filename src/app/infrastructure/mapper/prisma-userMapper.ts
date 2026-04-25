import { user as PrismaUser } from '@prisma/client';

import { UserEntity } from '../../domain/entities/user/user.entity';

export class PrismaUserMapper {
  static toDomain(data: PrismaUser) {
    return new UserEntity(
      data.id,
      data.name,
      data.email,
      data.password,
      data.active,
      data.createdAt,
      data.updatedAt,
    );
  }

  static toDomainList(data: PrismaUser[]): UserEntity[] {
    const newResult: UserEntity[] = [];

    for (const newData of data) {
      const entity = new UserEntity(
        newData.id,
        newData.name,
        newData.email,
        newData.password,
        newData.active,
        newData.createdAt,
        newData.updatedAt,
      );
      newResult.push(entity);
    }

    return newResult;
  }
}
