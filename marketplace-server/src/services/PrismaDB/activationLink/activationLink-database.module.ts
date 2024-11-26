import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ActivationLinkDatabaseService } from './activationLink-database.service';

@Module({
  providers: [
    ActivationLinkDatabaseService,
    PrismaService
  ],
  exports: [ActivationLinkDatabaseService],
})
export class ActivationLinkDatabaseModule {}