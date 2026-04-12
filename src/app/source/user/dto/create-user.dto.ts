import { IsString, IsEmail, IsNotEmpty, IsBoolean, Min } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Min(8)
  password!: string;

  @IsBoolean()
  actived!: boolean;
}
