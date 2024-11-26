import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ImageDatabaseService } from './image-database.service';

@Module({
  providers: [
    ImageDatabaseService,
    PrismaService
  ],
  exports: [ImageDatabaseService],
})
export class ImageDatabaseModule {}