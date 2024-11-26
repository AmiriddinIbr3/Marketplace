import { Controller, Post, UseInterceptors, UploadedFiles, BadRequestException, Res, Body, UseGuards, Req, Get, Param, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductService } from './product.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { productImagesType } from 'src/types/file-types';

import { FileValidation } from 'src/pipes/fileValidation';
import { getNonUnique, isFileUniqueComparedToOther } from 'src/helpers/file/file-checker';
import { getRandomElementFromArray } from 'src/helpers/utils';

import { CheckAccessTokenGuard } from 'src/pipes/checkAccessToken.pipe';
import { Request } from 'express';
import { copyFile } from 'src/helpers/file/file';

@Controller('product')
export class ProductController {
  private readonly imageValidation: FileValidation;

  constructor(
    private readonly productService: ProductService,
    private readonly configService: ConfigService,
  ) {
    this.imageValidation = new FileValidation(2, ['image/jpeg', 'image/png']);
  }

  @Post()
  @UseGuards(CheckAccessTokenGuard)
  @UseInterceptors(FileFieldsInterceptor(
    [
      { name: 'mainImage', maxCount: 1 },
      { name: 'images', maxCount: 3 },
    ]
  ))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: productImagesType,
    @Req() req: Request,
  ) {
    const user = req.user;
    let { images, mainImage } = files;
    const uploadDir = this.configService.get<string>('GLOBAL_PRODUCT_IMAGES_DIR');
    
    if(!images || images.length === 0){
      throw new BadRequestException('No images provided');
    }

    if(!mainImage){
      mainImage = copyFile(getRandomElementFromArray(images), 'mainImage');
    }
    else {
      mainImage = mainImage[0];
    }
    
    if (!mainImage.copiedPath) {
      const isUnique = await isFileUniqueComparedToOther(mainImage, images);
      const nonUniqueImage = await getNonUnique(uploadDir, mainImage);

      if (!isUnique || nonUniqueImage) {
        mainImage.copiedPath = true;
      }
    }
    
    const nonUniqueImages = await getNonUnique(uploadDir, images);
    if (nonUniqueImages) {
      for(const image of nonUniqueImages) {
        image.copiedPath = true;
      }
    }
    
    mainImage = await this.imageValidation.transform(mainImage);
    images = await this.imageValidation.transform(images);

    const product = await this.productService.create(user.id, createProductDto, {mainImage, images}, uploadDir);

    return product;
  }

  @Post('like/:id')
  @UseGuards(CheckAccessTokenGuard)
  async like(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const user = req.user;

    return await this.productService.like(user.id, id);
  }

  @Get(':id')
  @UseGuards(CheckAccessTokenGuard)
  async findOne(
    @Param('id') id: string,
  ) {
    return await this.productService.findOne(id);
  }

  @Get()
  @UseGuards(CheckAccessTokenGuard)
  async findPaginated(
    @Query('page') page: string,
    @Query('limit') limit: string
  ) {
    return await this.productService.findPaginated(+page, +limit);
  }

  @Get('getLikesCount/:id')
  @UseGuards(CheckAccessTokenGuard)
  async getLikesCount(
    @Param('id') id: string,
  ) {
    return await this.productService.getLikesCount(id);
  }
}
