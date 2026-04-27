import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDTO {
  @ApiProperty({
    type: String,
    example: "Name for user",
    description: "Name for user",
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    type: String,
    example: "email@email.com",
    description: "Email for user",
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    type: String,
    example: "1~)u5sQMs6{L",
    description: "Password for user",
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
