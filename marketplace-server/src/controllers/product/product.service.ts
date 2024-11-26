import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { productImagesType } from 'src/types/file-types';
import { ProductDatabaseService } from 'src/services/PrismaDB/product/product-database.service';
import { create } from 'src/helpers/file/file';
import { ImageDatabaseService } from 'src/services/PrismaDB/image/image-database.service';
import { LikeDatabaseService } from 'src/services/PrismaDB/like/like-database.service';
import { NotificationService } from 'src/services/Sse/notification/notification.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly likeDatabase: LikeDatabaseService,
    private readonly imageDatabase: ImageDatabaseService,
    private readonly productDatabase: ProductDatabaseService,
    @Inject(NotificationService) private readonly notificationService: NotificationService,
  ) {}

  async create(userId: string, createProductDto: CreateProductDto, { mainImage, images }: productImagesType, uploadDir: string) {
    let { title, price, description } = createProductDto;

    if (!description) {
      description = '.';
    }

    const mainImagePath = await create(uploadDir, mainImage);
    const imagesPaths = await create(uploadDir, images);

    const mainImageRecord = await this.imageDatabase.createByUserId(userId, mainImagePath);
    const mainImageId = mainImageRecord.id;

    const imagesRecords = await Promise.all(
      imagesPaths.map(path => this.imageDatabase.createByUserId(userId, path))
    );
    const imagesIds = imagesRecords.map(record => record.id);

    const product = await this.productDatabase.createProductByUserId(userId, title, price, description, mainImageId, imagesIds);

    return product;
  }

  async findOne(id: string) {
    const product = await this.productDatabase.findProductById(id);
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return product;
  }

  async findPaginated(page: number, limit: number) {
    if (isNaN(page) || page <= 0) {
      throw new BadRequestException('Invalid page number');
    }

    if (isNaN(limit) || limit <= 0) {
      throw new BadRequestException('Invalid limit');
    }

    return await this.productDatabase.findProductsPaginated(page, limit);
  }

  async like(userId: string, productId: string) {
    const product = await this.productDatabase.findProductById(productId);
    if (!product) {
      throw new BadRequestException('There is no such product');
    }
    
    const like = await this.likeDatabase.findLikeByUserAndProduct(userId, productId);
    if (!like) {
      await this.likeDatabase.createLike(userId, productId);
      
      this.notificationService.placeNotice(product.authorId, {
        title: 'Like',
        body: `Your product: ${product.title} liked`,
      });

      return 'you liked post';
    }
    else {
      await this.likeDatabase.removeLike(like.id, productId);
      return 'like deleted';
    }
  }

  async getLikesCount(productId: string): Promise<number> {
    const product = await this.productDatabase.findProductById(productId);
    if (!product) {
      throw new BadRequestException('There is no such product');
    }

    return await this.productDatabase.getLikesCount(productId);
  }
}
