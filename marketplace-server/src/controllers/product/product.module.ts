import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ConfigModule } from '@nestjs/config';
import { ProductDatabaseService } from 'src/services/PrismaDB/product/product-database.service';
import { ImageDatabaseService } from 'src/services/PrismaDB/image/image-database.service';
import { PrismaService } from 'prisma/prisma.service';
import { UserDatabaseService } from 'src/services/PrismaDB/user/user-database.service';
import { ActivationLinkDatabaseService } from 'src/services/PrismaDB/activationLink/activationLink-database.service';
import { JWTService } from 'src/services/jwt/jwt.service';
import { LikeDatabaseService } from 'src/services/PrismaDB/like/like-database.service';
import { NoticeDatabaseService } from 'src/services/PrismaDB/notice/notice-database.service';
import { NotificationModule } from 'src/services/Sse/notification/notification.module';

@Module({
  imports: [
    ConfigModule,
    NotificationModule,
  ],
  controllers: [ProductController],
  providers: [
    JWTService,
    PrismaService,
    ProductService,
    LikeDatabaseService,
    UserDatabaseService,
    ActivationLinkDatabaseService,
    ImageDatabaseService,
    ProductDatabaseService,
    NoticeDatabaseService,
  ],
})
export class ProductModule {}
