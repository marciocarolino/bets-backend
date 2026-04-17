import { user } from '@prisma/client';

export class UserMapper {
  static toUserResponse(user: user) {
    return {
      name: user.name,
      email: user.email,
      actived: user.actived,
    };
  }

  static toUserResponseList(user: user[]) {
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
