import { Module } from '@nestjs/common';
import { UserController } from '../../controllers/user/user.controller';
import { UserService } from '../../application/services/user/user.service';
import { USER_REPOSITORY } from '../../domain/repositories/user/user-repository.token';
import { PrismaUserRepository } from '../../infrastructure/user/prisma-userRepository';

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
