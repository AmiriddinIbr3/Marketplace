import { IsEmail, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
