import { Module } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserController } from '../../controllers/user/user.controller';
import { UserService } from './user.service';
import { UserRepository } from '../../repositories/user/user.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
