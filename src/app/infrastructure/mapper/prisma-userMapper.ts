import { user as PrismaUser } from "@prisma/client";

import { UserEntity } from "../../domain/entities/user/user.entity";

export class PrismaUserMapper {
  static toDomain(data: PrismaUser): UserEntity {
    return new UserEntity(
      data.id,
      data.email,
      data.name,
      data.password,
      data.active,
      data.createdAt,
      data.updatedAt,
    );
  }

  static toDomainList(data: PrismaUser[]): UserEntity[] {
    return data.map(
      (item) =>
        new UserEntity(
          item.id,
          item.email,
          item.name,
          item.password,
          item.active,
          item.createdAt,
          item.updatedAt,
        ),
    );
  }
}
