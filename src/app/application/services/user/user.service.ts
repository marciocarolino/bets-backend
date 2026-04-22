import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user/IUser-repository';
import { USER_REPOSITORY } from '../../../domain/repositories/user/user-repository.token';
import { UserEntity } from '../../../domain/entities/user/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  // async findByEmail(email: string): Promise<UserEntity | null> {}

  // async save(user: UserEntity): Promise<UserEntity> {}
}
