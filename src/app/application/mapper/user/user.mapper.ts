import { UserEntity } from "../../../domain/entities/user/user.entity";

export class UserMapper {
  static toUserResponse(users: UserEntity) {
    return {
      name: users.name,
      email: users.email,
      active: users.active,
    };
  }

  static toUserResponseList(users: UserEntity[]) {
    const result = users.map((r) => {
      return {
        name: r.name,
        email: r.email,
        active: r.active,
      };
    });

    return result;
  }
}
