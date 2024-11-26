import { Injectable } from '@nestjs/common';
import { Token } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { TokenWithUser } from 'src/types/user-types';

@Injectable()
export class TokenDatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  async updateRefreshToken(refreshToken: Token, newValue: string): Promise<Token> {
    try {
      return await this.prisma.token.update({
        where: {
            id: refreshToken.id,
        },
        data: {
            token: newValue,
        },
      });
    } catch(error) {
      console.log(error);
      throw new Error('Error during updating refresh token');
    }
  }

  async createByUserId(userId: string, token: string): Promise<Token> {
    try {
      return await this.prisma.token.create({
        data: {
            token: token,
            userId: userId,
        },
      });
    } catch(error) {
      console.log(error);
      throw new Error('Error during updating token');
    }
  }

  async findUniqueByUserId(userId: string): Promise<Token | null> {
    return await this.prisma.token.findUnique({
      where: {
          userId: userId,
      }
    });
  }

  async deleteRefreshToken(tokenId: string): Promise<void> {
    try {
      await this.prisma.token.delete({
          where: {
              id: tokenId,
          }
      });
    } catch(error) {
      console.log(error);
      throw new Error('Error during deleting token');
    }
  }

  async findRefreshTokenWithUser(token: string): Promise<TokenWithUser | null> {
    return await this.prisma.token.findUnique({
        where: {
            token: token,
        },
        include: { user: true }
    });
  }

  async saveOrUpdateByUserId(userId: string, token: string): Promise<void> {
    try {
      const refreshToken = await this.findUniqueByUserId(userId);

      if (refreshToken) {
        await this.updateRefreshToken(refreshToken, token);
      }
      else {
        await this.createByUserId(userId, token);
      }
    } catch(error) {
      console.log(error);
      throw new Error('Error during updating or saving token');
    }
  }
}