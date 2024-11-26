import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { getExpirationInHours, getExpirationInMinutes } from 'src/helpers/utils';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UserTokenPayloadDto } from './dto/create-tokenPayload.dto';
import { userTokenPayload } from 'src/types/token-types';

@Injectable()
export class JWTService {
    constructor(
        private readonly configService: ConfigService,
    ) {}

    generateTokens(payload: Partial<userTokenPayload>): {
        accessToken: string,
        refreshedToken: string,
    } {
        const expirationAccess = getExpirationInMinutes(this.configService.get<number>('ACCESS_TOKEN_EXPIRING_MINUTES'));
        const expirationRefresh = getExpirationInHours(this.configService.get<number>('REFRESH_TOKEN_EXPIRING_HOURS'));

        const accessToken = jwt.sign(payload, this.configService.get<string>('JWT_ACCESS_SECRET'), { expiresIn: expirationAccess });
        const refreshedToken = jwt.sign(payload, this.configService.get<string>('JWT_REFRESH_SECRET'), { expiresIn: expirationRefresh });
        return { accessToken, refreshedToken };
    }

    validateRefreshToken(refreshToken: string): userTokenPayload | undefined {
        try {
            return jwt.verify(
                refreshToken,
                this.configService.get<string>('JWT_REFRESH_SECRET')
            ) as userTokenPayload;;
        } catch (error) {
            return undefined;
        }
    }

    validateAccessToken(accessToken: string): userTokenPayload | undefined {
        try {
            return jwt.verify(
                accessToken,
                this.configService.get<string>('JWT_ACCESS_SECRET')
            ) as userTokenPayload;
        } catch (error) {
            return undefined;
        }
    }

    async transformAndValidate(payload: any): Promise<userTokenPayload> {
        const userTokenPayloadDto = plainToInstance(UserTokenPayloadDto, payload);
      
        try {
          await validateOrReject(userTokenPayloadDto);
          return userTokenPayloadDto as userTokenPayload;
        } catch (error) {
          console.log(error);
          throw new Error('Invalid payload');
        }
    }
}