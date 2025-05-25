import { IsNotEmpty, IsString, IsArray } from "class-validator";

export class CreateApplicationDTO {
  @IsString()
  @IsNotEmpty()
  roles: string;

  @IsString()
  @IsNotEmpty()
  courseCode: string;

  @IsString()
  @IsNotEmpty()
  courseName: string;

  @IsString()
  @IsNotEmpty()
  outcome: string;

  @IsString()
  expressionOfInterest: string;

  @IsString()
  note: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsArray()
  courseSkills: string[];

  @IsArray()
  tutorSkills: string[];

  @IsString()
  @IsNotEmpty()
  skillsFulfilled: string;
}