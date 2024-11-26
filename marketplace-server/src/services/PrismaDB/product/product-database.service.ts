import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { MAX_INT } from 'src/types/errors-types';
import { SendProduct, SendProductAndTotal } from 'src/types/product-types';

@Injectable()
export class ProductDatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  async createProductByUserId(
    userId: string,
    title: string,
    price: number,
    description: string,
    mainImageId: string,
    imagesIds: string[],
  ): Promise<Product> {
    try {
      return await this.prisma.product.create({
        data: {
          title,
          price,
          description,
          authorId: userId,
          mainImageId,
          images: {
            connect: imagesIds.map(
              id => ({
                id
              })
            ),
          },
        },
        include: {
          images: true,
          mainImage: true,
        },
      });
    } catch(error) {
      console.log(error);
      throw new Error('Error during creating product');
    }
  }

  async findProductById(productId: string): Promise<SendProduct | null> {
    try {
      return await this.prisma.product.findUnique({
        where: { id: productId },
        select: {
          id: true,
          title: true,
          price: true,
          description: true,
          likes: true,
          mainImageId: true,
          images: {
            select: {
              id: true,
            },
          },
          authorId: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error('Error during fetching imagesids with info');
    }
  }

  async findProductsPaginated(page: number = 1, limit: number = 10): Promise<SendProductAndTotal> {
    try {
      const pageNumber = page > 0 ? page : 1;
      const pageSize = limit > 0 ? limit : 10;
      const skip = (pageNumber - 1) * pageSize;

      const total = await this.prisma.product.count();

      const products = await this.prisma.product.findMany({
        skip,
        take: pageSize,
        orderBy: { id: 'asc' },
        select: {
          id: true,
          title: true,
          price: true,
          description: true,
          likes: true,
          mainImageId: true,
          images: {
            select: {
              id: true,
            },
          },
          authorId: true,
        },
      });

      return {
        products,
        total,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Error during fetching imagesids with info');
    }
  }

  async getLikesCount(
    productId: string,
  ): Promise<number> {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id: productId
        },
        select: {
          likes: true
        },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      return product.likes;
    }
    catch(error) {
      console.log(error);
      throw new Error('Error during get likes count');
    }
  }

  async incrementLikes(
    productId: string
  ): Promise<void> {
    try {
      const likesCount = await this.getLikesCount(productId);

      if (likesCount >= MAX_INT + 1) {
        throw new Error('Likes value has reached the maximum limit');
      }

      await this.prisma.product.update({
        where: {
          id: productId
        },
        data: {
          likes: {
            increment: 1
          }
        }
      });
    }
    catch(error) {
      console.log(error);
      throw new Error('Error during incrementing like');
    }
  }

  async decrementLikes(
    productId: string
  ): Promise<void> {
    try {
      const likesCount = await this.getLikesCount(productId);

      if (likesCount <= 0) {
        throw new Error('Likes value can\'t be lower than 0');
      }

      await this.prisma.product.update({
        where: {
          id: productId
        },
        data: {
          likes: {
            decrement: 1
          }
        }
      });
    }
    catch(error) {
      console.log(error);
      throw new Error('Error during decrementing like');
    }
  }
}