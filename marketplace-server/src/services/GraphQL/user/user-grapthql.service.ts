import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { ProfileDatabaseService } from "src/services/PrismaDB/profile/profile-database.service";
import { UserDatabaseService } from "src/services/PrismaDB/user/user-database.service";

@Injectable()
export class GraphqlUserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userDatabase: UserDatabaseService,
        private readonly profileDatabase: ProfileDatabaseService,
    ) {}

    async findUserById(userId: string) {
        const user = await this.userDatabase.findUserById(userId);
        const profile = await this.profileDatabase.findAvatars(userId);

        return {
            ...user,
            profile
        }
    }
}