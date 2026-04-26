import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { UserEntity } from '../../../domain/entities/user/user.entity';
import type { IUserRepository } from '../../../domain/repositories/user/IUser-repository';
import { USER_REPOSITORY } from '../../../domain/repositories/user/user-repository.token';
import { ExceptionUtils } from '../../../utils/exception.utils';
import { HashPassword } from '../../../utils/hashPassword.utils';
import { CreateUserDataMapper } from '../../mapper/user/data/create-user-data.mapper';
import { FindUserDataMapper } from '../../mapper/user/data/find-user-data.mapper';
import { CreateUserInput } from '../../users/dto-or-input/create-user.input';
import { UserEmailInput } from '../../users/dto-or-input/user-email-input';
import { UpdateUserInput } from '../../users/dto-or-input/update-user.input';
import { UpdateUserDataMapper } from '../../mapper/user/data/update-user-data.mapper';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async findByEmail(email: UserEmailInput): Promise<UserEntity> {
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

    const hashedPassword = await HashPassword(user.password);

    const data = CreateUserDataMapper.toDomainData(user, hashedPassword);

    return this.userRepository.create(data);
  }

  async update(user: UpdateUserInput):Promise<UserEntity>{
    //validar email
   const validateEmail = UpdateUserDataMapper.toDomainData(user);

   const verifyEmail = await this.userRepository.findByEmail(validateEmail);

   if(!verifyEmail){
    throw new ExceptionUtils('Email not Found!', HttpStatus.NOT_FOUND);
   }

    //Verificar se a senha foi alterado.

    // retorno do update

  }

}
