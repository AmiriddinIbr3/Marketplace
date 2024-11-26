import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { JWTService } from 'src/services/jwt/jwt.service';
import { UserDatabaseService } from 'src/services/PrismaDB/user/user-database.service';

@Injectable()
export class CheckAccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JWTService,
    private readonly userDatabase: UserDatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is empty');
    }

    const [scheme, accessToken] = authorizationHeader.split(' ');
    if (scheme !== 'Bearer' || !accessToken) {
      throw new BadRequestException('Incorrect header format');
    }

    const isValid = this.jwtService.validateAccessToken(accessToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid access token');
    }

    const user = await this.userDatabase.findUserByUsername(isValid.username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    request.user = user;
    request.accessToken = accessToken;
    return true;
  }
}