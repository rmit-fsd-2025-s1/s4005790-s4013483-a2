import { IsNotEmpty, IsString, IsEmail, MaxLength, MinLength } from "class-validator";

export class UpdateLecturerDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(40)
  name: string;

  @IsEmail()
  @MaxLength(256)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}
