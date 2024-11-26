import { IsString } from 'class-validator';

export class UserTokenPayloadDto {
    @IsString()
    id: string;

    @IsString()
    name: string;

    @IsString()
    surname: string;

    @IsString()
    username: string;
}