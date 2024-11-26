import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LikeDatabaseService } from './like-database.service';
import { ProductDatabaseService } from '../product/product-database.service';

@Module({
  providers: [
    ProductDatabaseService,
    LikeDatabaseService,
    PrismaService
  ],
  exports: [LikeDatabaseService],
})
export class LikeDatabaseModule {}