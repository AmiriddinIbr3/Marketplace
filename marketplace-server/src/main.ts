import { NestFactory } from '@nestjs/core';
import { AppModule } from './controllers/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser(configService.get<string>('COOKIE_PARSER_SECRET')));

  app.setGlobalPrefix('/api');
  app.enableCors({
    credentials: true,
    origin: `${configService.get<string>('CLIENT_URL')}:${configService.get<string>('CLIENT_PORT')}`,
  })

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  await app.listen(configService.get<number>('API_PORT'));
}

bootstrap();