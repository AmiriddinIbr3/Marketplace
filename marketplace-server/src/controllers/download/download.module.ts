import { Module } from '@nestjs/common';
import { DownloadService } from './download.service';
import { DownloadController } from './download.controller';
import { ImageDatabaseService } from 'src/services/PrismaDB/image/image-database.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [DownloadController],
  providers: [
    PrismaService,
    DownloadService,
    ImageDatabaseService,
  ],
})
export class DownloadModule {}
