import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user/IUser-repository';
import { USER_REPOSITORY } from '../../../domain/repositories/user/user-repository.token';
import { UserEntity } from '../../../domain/entities/user/user.entity';
import { CreateUserInput } from '../../users/dto-or-input/create-user.input';
import { ExceptionUtils } from '../../../utils/exception.utils';
import { hashPassword } from '../../../utils/hashPassword.utils';
import { CreateUserDataMapper } from '../../mapper/user/create-user-data.mapper';

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
    return await this.userRepository.findByEmail(email);
  }

  async save(user: CreateUserInput): Promise<UserEntity> {
    const verifyEmail = await this.userRepository.findByEmail(user.email);

    if (verifyEmail) {
      throw new ExceptionUtils('User already registered!', HttpStatus.CONFLICT);
    }

    const hashedPassword = await hashPassword(user.password);

    const data = CreateUserDataMapper.toDomainData(user, hashedPassword);

    return this.userRepository.create(data);
  }
}
