import { Inject, Injectable } from '@nestjs/common';
import { INoticePayload, INoticeSend, NoticeDatabaseService } from 'src/services/PrismaDB/notice/notice-database.service';
import { SeeConfig } from '../SSEConfig';
import Redis from 'ioredis';

@Injectable()
export class NotificationService extends SeeConfig<INoticeSend> {
    private readonly expireTimeInSeconds = 30;
    private readonly pendingNoticesPrefixKey = "pendingNotices:";

    constructor(
        private readonly noticeDatabase: NoticeDatabaseService,
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
    ) {
        super();
    }

    public async placeNotice(userId: string, notice: INoticePayload): Promise<void> {
        const existingNotice = await this.noticeDatabase.findByTitleAndBodyAndUserId(userId, notice.title, notice.body);
        if (existingNotice) return;

        const newNotice: INoticeSend = await this.noticeDatabase.saveNotice(userId, notice);

        if (this.isEventActive(userId)) {
            this.emitEvent(userId, newNotice);
        }
        else {
            const noticesKey = this.pendingNoticesPrefixKey + userId;

            if (this.redis.exists(noticesKey)) {
                await this.redis.rpush(noticesKey, JSON.stringify(newNotice));
            }
            else {
                await this.redis.set(noticesKey, JSON.stringify(newNotice), "EX", this.expireTimeInSeconds);
            }
        }
    }

    public async handleUser(userId: string): Promise<void> {
        const noticesKey = this.pendingNoticesPrefixKey + userId;
        const notices = await this.redis.lrange(noticesKey, 0, -1);

        if (notices.length > 0) {
            notices.forEach(notice => {
                this.emitEvent(userId, JSON.parse(notice));
            });
        }

        await this.redis.del(noticesKey);
    }
}