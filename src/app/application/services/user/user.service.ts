import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user/IUser-repository';
import { USER_REPOSITORY } from '../../../domain/repositories/user/user-repository.token';
import { UserEntity } from '../../../domain/entities/user/user.entity';
import { CreateUserInput } from '../../users/dto-or-input/create-user.input';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const findEmail = await this.userRepository.findByEmail(email);

    if (findEmail === null) {
      return null;
    }

    return findEmail;
  }

  async save(user: CreateUserInput): Promise<UserEntity> {
    const verifyEmail = await this.findByEmail(user.email);

    if (verifyEmail) {
      return verifyEmail;
    }

    return this.userRepository.save(user);
  }
}
