import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JWTService } from 'src/services/jwt/jwt.service';
import { TokenDatabaseService } from 'src/services/PrismaDB/token/token-database.service';
import { UserDatabaseService } from 'src/services/PrismaDB/user/user-database.service';

@Injectable()
export class CheckRefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JWTService,
    private readonly tokenDatabase: TokenDatabaseService,
    private readonly userDatabase: UserDatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    const refreshToken = request.signedCookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    
    const isValid = this.jwtService.validateRefreshToken(refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    
    const token = await this.tokenDatabase.findRefreshTokenWithUser(refreshToken);
    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    
    request.user = token.user;
    request.refreshToken = token;
    return true;
  }
}