import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UserDatabaseService } from 'src/services/PrismaDB/user/user-database.service';
import { JWTService } from 'src/services/jwt/jwt.service';
import { MailService } from 'src/services/mail/mail.service';
import { TokenDatabaseService } from 'src/services/PrismaDB/token/token-database.service';
import { ActivationLinkDatabaseService } from 'src/services/PrismaDB/activationLink/activationLink-database.service';
import { ProfileDatabaseService } from 'src/services/PrismaDB/profile/profile-database.service';
import { ImageDatabaseService } from 'src/services/PrismaDB/image/image-database.service';
import { FileValidation } from 'src/pipes/fileValidation';
import { NoticeDatabaseService } from 'src/services/PrismaDB/notice/notice-database.service';
import { NotificationModule } from 'src/services/Sse/notification/notification.module';
import { GRPCModule } from 'grpc/GRPC.module';

@Module({
  imports: [
    ConfigModule,
    NotificationModule,
    GRPCModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    FileValidation,
    UserDatabaseService,
    ImageDatabaseService,
    TokenDatabaseService,
    ProfileDatabaseService,
    ActivationLinkDatabaseService,
    JWTService,
    {
      provide: 'MAIL_SERVICE',
      useValue: 'MAILRU',
    },
    MailService,
    NoticeDatabaseService,
  ],
})
export class UserModule {}
// implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(createRateLimiterMiddleware(5, 30))
//       .forRoutes(
//         { path: 'user/registration', method: RequestMethod.POST },
//         { path: 'user/login', method: RequestMethod.POST },
//         { path: 'user/refresh', method: RequestMethod.GET }
//       );

//     consumer
//       .apply(createRateLimiterMiddleware(3, 60))
//       .forRoutes(
//         { path: 'user/activate/:link', method: RequestMethod.GET }
//       );
//   }
// }