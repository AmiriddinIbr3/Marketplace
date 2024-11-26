import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const redisProvider: Provider = {
    provide: 'REDIS_CLIENT',
    useFactory: (configService: ConfigService) => {
        const redis = new Redis({
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
        });
        return redis;
    },
    inject: [ConfigService],
};