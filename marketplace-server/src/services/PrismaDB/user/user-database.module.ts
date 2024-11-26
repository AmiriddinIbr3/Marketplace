import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserDatabaseService } from './user-database.service';
import { ActivationLinkDatabaseService } from '../activationLink/activationLink-database.service';

@Module({
  providers: [
    ActivationLinkDatabaseService,
    UserDatabaseService,
    PrismaService
  ],
  exports: [UserDatabaseService],
})
export class UserDatabaseModule {}