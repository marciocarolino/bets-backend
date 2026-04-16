import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { user } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<user[]> {
    const result = await this.prisma.user.findMany({
      where: { actived: true },
    });

    return result;
  }
}
