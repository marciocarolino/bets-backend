import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForAuthUserDTO {
  @ApiProperty({
    type: String,
    example: 'Email for user',
    description: 'Email for user',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
