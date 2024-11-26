import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from '../product/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailerInfo } from 'src/helpers/config';
import { DownloadModule } from '../download/download.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GraphqlUserModule } from 'src/services/GraphQL/user/user-graphql.module';
import { ChatGateway } from 'src/webSocketGateways/chat.gateway';

@Module({
  imports: [
    UserModule,
    ProductModule,
    DownloadModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getMailerInfo('MAILRU', configService)
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'prisma/schema.graphql'),
      playground: process.env.ENV==='dev',
      context: ({ req }) => ({ request: req }),
    }),
    GraphqlUserModule,
    ChatGateway,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
  ],
  exports: [],
})
export class AppModule {}