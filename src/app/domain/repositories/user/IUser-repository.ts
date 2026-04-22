import { UserEntity } from '../../entities/user/user.entity';

export interface IUserRepository {
  findAll(): Promise<UserEntity[]>;

  findByEmail(email: string): Promise<UserEntity | null>;

  save(user: UserEntity): Promise<UserEntity>;
}
