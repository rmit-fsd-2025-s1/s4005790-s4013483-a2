import { IsNotEmpty, IsString, IsEmail, MaxLength } from "class-validator";

export class UpdateTutorDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  @IsEmail()
  // @IsNotEmpty()
  @MaxLength(256)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  password: string;
}

