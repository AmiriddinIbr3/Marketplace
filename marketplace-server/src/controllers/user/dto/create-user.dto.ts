import { IsEmail, IsOptional, IsString, IsStrongPassword, Length } from "class-validator";

export class CreateUserDto {
    @Length(2, 12)
    @IsString()
    name: string;

    @IsOptional()
    @Length(2, 18)
    @IsString()
    surname?: string;

    @IsString()
    @Length(2, 18)
    username: string;
    
    @IsEmail()
    email: string;

    @IsString()
    @Length(8, 20)
    @IsStrongPassword()
    password: string;

    @IsString()
    phone: string;
}
