import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user/IUser-repository';
import { USER_REPOSITORY } from '../../../domain/repositories/user/user-repository.token';
import { UserEntity } from '../../../domain/entities/user/user.entity';
import { CreateUserInput } from '../../users/dto-or-input/create-user.input';
import { ExceptionUtils } from '../../../utils/exception.utils';
import { hashPassword } from '../../../utils/hashPassword.utils';
import { FindUserEmailInput } from '../../users/dto-or-input/find-user-email-input';
import { FindUserDataMapper } from '../../mapper/user/data/find-user-data.mapper';
import { CreateUserDataMapper } from '../../mapper/user/data/create-user-data.mapper';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async findByEmail(email: FindUserEmailInput): Promise<UserEntity> {
    const newEmail = FindUserDataMapper.toDomainData(email);

    const findEmail = await this.userRepository.findByEmail(newEmail);

    if (!findEmail) {
      throw new ExceptionUtils('User Not Found!', HttpStatus.NOT_FOUND);
    }

    return findEmail;
  }

  async create(user: CreateUserInput): Promise<UserEntity> {
    const newEmail = FindUserDataMapper.toDomainData(user);

    const verifyEmail = await this.userRepository.findByEmail(newEmail);

    if (verifyEmail) {
      throw new ExceptionUtils('User already registered!', HttpStatus.CONFLICT);
    }

    const hashedPassword = await hashPassword(user.password);

    const data = CreateUserDataMapper.toDomainData(user, hashedPassword);

    return this.userRepository.create(data);
  }
}
