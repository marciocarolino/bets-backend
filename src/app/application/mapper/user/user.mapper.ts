import { UserEntity } from '../../../domain/entities/user/user.entity';

export class UserMapper {
  static toUserResponse(users: UserEntity) {
    return {
      email: users.email,
      name: users.name,
      active: users.active,
    };
  }

  static toUserResponseList(users: UserEntity[]) {
    const result = users.map((r) => {
      return {
        email: r.email,
        name: r.name,
        active: r.active,
      };
    });

    return result;
  }

  static toUpdateUserResponse(users: UserEntity){
    return {
      email: users.email,
      name: users.name,
      active: users.active,
      updatedAt: users.updatedAt
    }
  }
}
