import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProfileDatabaseService } from './profile-database.service';

@Module({
  providers: [
    ProfileDatabaseService,
    PrismaService
  ],
  exports: [ProfileDatabaseService],
})
export class ProfileDatabaseModule {}