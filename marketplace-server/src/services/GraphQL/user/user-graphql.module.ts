import { Module } from "@nestjs/common";
import { GraphqlUserResolver } from "./user-graphql.resolver";
import { GraphqlUserService } from "./user-grapthql.service";
import { PrismaService } from "prisma/prisma.service";
import { UserDatabaseService } from "src/services/PrismaDB/user/user-database.service";
import { ActivationLinkDatabaseService } from "src/services/PrismaDB/activationLink/activationLink-database.service";
import { ProfileDatabaseService } from "src/services/PrismaDB/profile/profile-database.service";

@Module({
    providers: [
        GraphqlUserService,
        GraphqlUserResolver,
        PrismaService,
        UserDatabaseService,
        ProfileDatabaseService,
        ActivationLinkDatabaseService,
    ],
})

export class GraphqlUserModule {}