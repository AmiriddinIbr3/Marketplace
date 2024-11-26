import { Injectable } from '@nestjs/common';
import { Image } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ImageDatabaseService {
  constructor(private readonly prisma: PrismaService) {}
  
  async createByUserId(authorId: string, url: string): Promise<Image> {
    try {
      return await this.prisma.image.create({
        data: {
          url,
          author: { connect: { id: authorId } },
        },
      })
    } catch(error) {
      console.log(error);
      throw new Error('Error during creating image');
    }
  }

  async findUniqueById(id: string): Promise<Image | null> {
    try {
      return await this.prisma.image.findUnique({
        where: {
          id: id,
        }
      })
    } catch(error) {
      console.log(error);
      throw new Error('Error during finding image');
    }
  }
}