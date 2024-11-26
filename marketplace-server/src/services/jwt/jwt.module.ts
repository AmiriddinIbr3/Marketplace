import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JWTService } from './jwt.service';

@Module({
  imports: [ConfigModule],
  providers: [JWTService],
  exports: [JWTService],
})
export class JWTModule {}