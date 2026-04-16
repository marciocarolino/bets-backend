import { ApiProperty } from '@nestjs/swagger';
import { user as UserClient } from '@prisma/client';

export class UserEntity implements UserClient {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;

  @ApiProperty()
  actived!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
