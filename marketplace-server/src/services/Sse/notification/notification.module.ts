import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { NotificationService } from './notification.service';
import { NoticeDatabaseService } from 'src/services/PrismaDB/notice/notice-database.service';
import { RedisModule } from 'redis/redis.module';

@Global()
@Module({
  imports: [
    RedisModule,
  ],
  providers: [
    NoticeDatabaseService,
    NotificationService,
    PrismaService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}