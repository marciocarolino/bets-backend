import { Module } from '@nestjs/common';

import { UserService } from '../../application/services/user/user.service';
import { USER_REPOSITORY } from '../../domain/repositories/user/user-repository.token';
import { PrismaUserRepository } from '../../infrastructure/user/prisma-userRepository';
import { UserController } from '../../interface/controllers/user/user.controller';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
