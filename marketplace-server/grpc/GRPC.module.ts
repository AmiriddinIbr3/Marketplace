import { Global, Module } from '@nestjs/common';
import { GRPCService } from './GRPC.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'PHONE_GRPC_PACKAGE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'phone',
            protoPath: join(process.cwd(), 'grpc/protos/phone.proto'),
            url: `${configService.get<string>('PHONE_SERVICE_HOST', 'localhost')}:${configService.get<string>('PHONE_SERVICE_PORT', '50051')}`,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'SMS_GRPC_PACKAGE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'sms',
            protoPath: join(process.cwd(), 'grpc/protos/sms.proto'),
            url: `${configService.get<string>('SMS_SERVICE_HOST', 'localhost')}:${configService.get<string>('SMS_SERVICE_PORT', '50051')}`,
          },
        }),
        inject: [ConfigService],
      }
    ]),
  ],
  providers: [GRPCService],
  exports: [GRPCService],
})
export class GRPCModule {}