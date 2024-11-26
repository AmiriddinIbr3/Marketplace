import { Injectable } from '@nestjs/common';
import { ActivationLink } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ActivationLinkDatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  async updateLink(link: ActivationLink, newValue: string): Promise<ActivationLink> {
    try {
      return await this.prisma.activationLink.update({
        where: {
          id: link.id,
        },
        data: {
          link: newValue,
        },
      });
    } catch(error) {
      console.log(error);
      throw new Error('Error during updating activation link');
    }
  }

  async createByUserId(userId: string, newValue: string): Promise<ActivationLink> {
    try {
      return await this.prisma.activationLink.create({
        data: {
            link: newValue,
            userId: userId,
        },
      });
    } catch(error) {
      console.log(error);
      throw new Error('Error during creating activation link');
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    try {
      await this.prisma.activationLink.delete({
        where: {
          id: userId
        }
      });
    } catch(error) {
      console.log(error);
      throw new Error('Error during deleting activation link');
    }
  }

  async findUniqueByUserId(userId: string): Promise<ActivationLink | null> {
    return await this.prisma.activationLink.findUnique({
      where: {
          userId: userId,
      }
    });
  }

  async saveOrUpdateByUserId(userId: string, link: string): Promise<void> {
    try {
      const activationLink = await this.findUniqueByUserId(userId);
  
      if (activationLink) {
        await this.updateLink(activationLink, link);
      }
      else {
        await this.createByUserId(userId, link);
      }
    } catch(error) {
      console.log(error);
      throw new Error('Error during updating or saving activation link');
    }
  }

  async findActivateLinkWithUser(link: string): Promise<ActivationLink | null> {
    return await this.prisma.activationLink.findUnique({
      where: { link: link },
      include: { user: true },
    });
  }
}