import { UserEntity } from '../../entities/user/user.entity';
import { CreateUserData } from './create-user.data';

export interface IUserRepository {
  findAll(): Promise<UserEntity[]>;

  findByEmail(email: string): Promise<UserEntity | null>;

  create(user: CreateUserData): Promise<UserEntity>;
}
