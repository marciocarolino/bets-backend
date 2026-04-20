import { UserEntity } from '../../entities/user/user.entity';

export class UserMapper {
  static toUserResponse(user: UserEntity) {
    return {
      name: user.name,
      email: user.email,
      actived: user.actived,
    };
  }

  static toUserResponseList(user: UserEntity[]) {
    const result = user.map((r) => {
      return {
        name: r.name,
        email: r.email,
        actived: r.actived,
      };
    });

    return result;
  }
}
