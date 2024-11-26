import { IsOptional, IsString } from 'class-validator';

export class ProfileUserDto {
  @IsOptional()
  @IsString()
  description?: string;
}
