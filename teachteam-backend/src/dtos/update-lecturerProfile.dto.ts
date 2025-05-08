import { IsString, IsNumber, IsOptional, Min, Max, Length } from 'class-validator';

export class UpdateLecturerProfileDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(120)
  age?: number;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  contact?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  biography?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  links?: string;
} 