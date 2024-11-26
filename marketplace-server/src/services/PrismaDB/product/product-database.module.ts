import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProductDatabaseService } from './product-database.service';

@Module({
  providers: [
    ProductDatabaseService,
    PrismaService
  ],
  exports: [ProductDatabaseService],
})
export class ProductDatabaseModule {}