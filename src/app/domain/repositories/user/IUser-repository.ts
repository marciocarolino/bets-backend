<<<<<<< HEAD
import { UserEntity } from '../../entities/user/user.entity';
import { CreateUserData } from './Icreate-user.data';
import { IFindUserEmailData } from './Ifind-user-email.data';
import { UpdateUserData } from './update-user.data';
=======
import { UserEntity } from "../../entities/user/user.entity";
import { CreateUserData } from "./Icreate-user.data";
import { IFindUserEmailData } from "./Ifind-user-email.data";
>>>>>>> e94be6266d4452547110615f3930e749e6adbf35

export interface IUserRepository {
  findAll(): Promise<UserEntity[]>;

  findByEmail(email: IFindUserEmailData): Promise<UserEntity | null>;

  create(user: CreateUserData): Promise<UserEntity>;

  update(user:  UserEntity): Promise<UserEntity>;
}
