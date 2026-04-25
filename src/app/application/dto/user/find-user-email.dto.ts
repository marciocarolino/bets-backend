import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindUserEmailDTO {
  @ApiProperty({
    example: 'Email for user',
    description: 'Email for user',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
