import { Injectable } from "@nestjs/common";
import { Like } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { ProductDatabaseService } from "../product/product-database.service";

@Injectable()
export class LikeDatabaseService {
    constructor(
        private readonly productDatabase: ProductDatabaseService,
        private readonly prisma: PrismaService
    ) {}

    async createLike(
        userId: string,
        productId: string,
    ): Promise<Like> {
        try {
            const like = await this.prisma.like.create({
                data: {
                    authorId: userId,
                    productId: productId,
                }
            });

            await this.productDatabase.incrementLikes(productId);

            return like;
        } catch(error) {
            console.log(error);
            throw new Error('Error during creating like');
        }
    }

    async removeLike(
        id: string,
        productId: string,
    ): Promise<Like> {
        try {
            const like = await this.prisma.like.delete({
                where: {
                    id,
                },
            });

            await this.productDatabase.decrementLikes(productId);

            return like;
        } catch(error) {
            console.log(error);
            throw new Error('Error during deleting like');
        }
    }

    async findLikeByUserAndProduct(
        userId: string,
        productId: string
    ): Promise<Like | null> {
        try {
            return await this.prisma.like.findUnique({
                where: {
                    authorId_productId: {
                        authorId: userId,
                        productId: productId,
                    },
                }
            });
        } catch(error) {
            console.log(error);
            throw new Error('Error during finding like');
        }
    }
}