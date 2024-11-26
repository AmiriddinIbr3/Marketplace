import { Injectable } from "@nestjs/common";
import { Notice } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

export interface INoticePayload {
    title: string,
    body: string,
}

export interface INoticeSend {
    id: string;
    title: string,
    body: string,
    checked: boolean,
    createdAt: Date,
}

@Injectable()
export class NoticeDatabaseService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async findByTitleAndBodyAndUserId(userId: string, title: string, body: string): Promise<Notice | null> {
        try {
            return await this.prisma.notice.findFirst({
                where: {
                    userId,
                    title,
                    body,
                },
            });
        } catch(error) {
            console.log(error);
            throw new Error('Error during finding notice');
        }
    }

    async saveNotice(userId: string, data: INoticePayload): Promise<Notice> {
        try {
            return await this.prisma.notice.create({
                data: {
                    userId: userId,
                    title: data.title,
                    body: data.body,
                },
            });
        } catch(error) {
            console.log(error);
            throw new Error('Error during creating notice');
        }
    }

    async findById(id: string): Promise<Notice | null> {
        try {
            return await this.prisma.notice.findUnique({
                where: {
                    id,
                },
            });
        } catch (error) {
            console.log(error);
            throw new Error('Error during finding notice');
        }
    }

    async findNoticesByUserId(userId: string): Promise<Notice[]> {
        try {
            return await this.prisma.notice.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
                where: {
                    userId,
                },
            });
        } catch (error) {
            console.log(error);
            throw new Error('Error during finding notices by user ID');
        }
    }
}