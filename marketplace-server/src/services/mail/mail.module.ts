import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UserDatabaseService } from '../PrismaDB/user/user-database.service';

@Module({
  imports: [ConfigModule],
  providers: [
    MailService,
    MailerService,
    UserDatabaseService,
  ],
  exports: [MailService],
})
export class MailModule {}