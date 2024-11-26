import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class ProfileDatabaseService {
  constructor(private readonly prisma: PrismaService) {}

    async findAvatars(userId: string) {
        try {
            return await this.prisma.profile.findUnique({
                where: {
                    userId,
                },
                include: {
                    avatars: true,
                }
            });
        }
        catch (error) {
            console.log(error);
            throw new Error('Failed during finding profile');
        }
    }

    async createProfile(
        userId: string,
        description?: string,
        avatarIds?: string[]
    ) {
        try {
            return await this.prisma.profile.create({
                data: {
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                    description: description ?? null,
                    avatars: avatarIds ? {
                        connect: avatarIds.map(id => ({ id })),
                    } : null,
                },
            });
        }
        catch (error) {
            console.log(error);
            throw new Error('Failed to create profile');
        }
    }

    async addAvatar(
        userId: string,
        avatarId: string,
    ) {
        try {
            return this.prisma.profile.update({
                where: {
                    userId
                },
                data: {
                    avatars: {
                        connect: {
                            id: avatarId,
                        }
                    }
                },
            });
        }
        catch (error) {
            console.log(error);
            throw new Error('Failed during adding avatar');
        }
    }
}