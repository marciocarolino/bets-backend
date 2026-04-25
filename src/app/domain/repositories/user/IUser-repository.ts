import { UserEntity } from '../../entities/user/user.entity';
import { CreateUserData } from './Icreate-user.data';
import { IFindUserEmailData } from './Ifind-user-email.data';

export interface IUserRepository {
  findAll(): Promise<UserEntity[]>;

  findByEmail(email: IFindUserEmailData): Promise<UserEntity | null>;

  create(user: CreateUserData): Promise<UserEntity>;
}
