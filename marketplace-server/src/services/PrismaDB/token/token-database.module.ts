import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TokenDatabaseService } from './token-database.service';

@Module({
  providers: [TokenDatabaseService, PrismaService],
  exports: [TokenDatabaseService],
})
export class TokenDatabaseModule {}