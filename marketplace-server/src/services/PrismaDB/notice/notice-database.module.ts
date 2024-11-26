import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { NoticeDatabaseService } from './notice-database.service';

@Module({
  providers: [
    NoticeDatabaseService,
    PrismaService
  ],
  exports: [NoticeDatabaseService],
})
export class NoticeDatabaseModule {}