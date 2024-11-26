import { Controller, Get, Post, Body, Param, Req, Res, BadRequestException, UseGuards, UseInterceptors, UploadedFiles, Inject } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RealIP } from 'nestjs-real-ip';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/login-user.dto';
import { CheckRefreshTokenGuard } from 'src/pipes/checkRefreshToken.pipe';
import { CheckAccessTokenGuard } from 'src/pipes/checkAccessToken.pipe';
import { plainToInstance } from 'class-transformer';
import { SendUserDto } from './dto/send-user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { getImageAspectRatio, getNonUnique } from 'src/helpers/file/file-checker';
import { FileValidation } from 'src/pipes/fileValidation';
import { NotificationService } from 'src/services/Sse/notification/notification.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly imageValidation: FileValidation,
    @Inject(NotificationService) private readonly notificationService: NotificationService,
  ) {
    this.imageValidation = new FileValidation(2, ['image/jpeg', 'image/png']);
  }

  @Post('registration')
  @Get('my-ip')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @RealIP() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    let { user, accessToken, refreshedToken, activationLink } = await this.userService.create(createUserDto, ip);
    const userInfo = plainToInstance(SendUserDto, user);

    this.sendRefreshedInfo(userInfo, refreshedToken, accessToken, res);
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { password, email, username, phone, countryCode } = loginUserDto;
    
    if (!email && !username && (!phone || !countryCode)) {
      throw new BadRequestException('Either email, username, phone must be provided');
    }
    
    let { accessToken, refreshedToken, user } = await this.userService.login(loginUserDto);
    const userInfo = plainToInstance(SendUserDto, user);

    this.sendRefreshedInfo(userInfo, refreshedToken, accessToken, res);
  }

  @Post('logout')
  @UseGuards(CheckRefreshTokenGuard)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken } = req;
    
    await this.userService.logout(refreshToken);

    res.clearCookie('refreshToken');

    return 'You have successfully logged out of your profile';
  }

  @Post('avatar')
  @UseGuards(CheckAccessTokenGuard)
  @UseInterceptors(FileFieldsInterceptor(
    [
      { name: 'avatar', maxCount: 1 },
    ]
  ))
  async addAvatar(
    @UploadedFiles() files: {
      avatar: Express.Multer.File
    },
    @Req() req: Request,
  ) {
    let { user } = req;
    let { avatar } = files;
    const uploadDir = this.configService.get<string>('GLOBAL_AVATAR_IMAGES_DIR');
    
    if (!avatar[0]) {
      throw new BadRequestException('Avatar isnt provided');
    }
    else {
      avatar = avatar[0]
    }

    const aspectRatio = await getImageAspectRatio(avatar);
    if (aspectRatio.aspectRatioWidth != aspectRatio.aspectRatioHeight) {
      throw new BadRequestException('Avatar should be square');
    }
    
    const nonUniqueImage = await getNonUnique(uploadDir, avatar);
    if (nonUniqueImage) {
      avatar.copiedPath = true;
    }
    
    avatar = await this.imageValidation.transform(avatar);
    
    await this.userService.addAvatar(user.id, avatar, uploadDir);

    this.notificationService.placeNotice(user.id, {
      title: 'Avatar',
      body: `${avatar.originalname} created`,
    });

    return 'avatar created';
  }

  @Get('refresh')
  @UseGuards(CheckRefreshTokenGuard)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    let { user, refreshToken } = req;
    
    const { accessToken, refreshedToken } = await this.userService.refreshToken(user);
    const userInfo = plainToInstance(SendUserDto, user);
 
    this.sendRefreshedInfo(userInfo, refreshedToken, accessToken, res);
  }

  @Get('checkAccessToken')
  @UseGuards(CheckAccessTokenGuard)
  async checkAccessToken(
    @Req() req: Request,
  ) {
    return plainToInstance(SendUserDto, req.user);
  }

  @Get('activate/:link')
  @UseGuards(CheckRefreshTokenGuard)
  async activate(
    @Param('link') link: string,
    @Res() response: Response,
  ) {
    await this.userService.activate(link);
    response.redirect(`${this.configService.get<string>('CLIENT_URL')}:${this.configService.get<string>('CLIENT_PORT')}`);
  }

  @Post('notification')
  @UseGuards(CheckAccessTokenGuard)
  sse(
    @Req() req: Request,
    @Res() response: Response,
  ): void {
    const { user } = req;
    
    if (this.notificationService.isEventActive(user.id)) {
      return;
    }

    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Connection', 'keep-alive');
    response.flushHeaders();

    const subscription = this.notificationService.getObservable(user.id).subscribe({
      next: (data) => {
        response.write(`data: ${JSON.stringify(data)}\n\n`);
      },
    });

    this.notificationService.handleUser(user.id);

    response.on('close', () => {
      this.notificationService.clearEvent(user.id);
      subscription.unsubscribe();
      response.end();
    });
  }

  @Get('notices')
  @UseGuards(CheckAccessTokenGuard)
  async getNotices(
    @Req() req: Request,
  ) {
    const { user } = req;

    return await this.userService.getNotices(user.id);
  }

  @Get('avatar')
  @UseGuards(CheckAccessTokenGuard)
  async getAvatars(
    @Req() req: Request,
  ) {
    const { user } = req;

    return await this.userService.getAvatars(user.id);
  }

  sendRefreshedInfo(user: SendUserDto, refreshedToken: string, accessToken: string, res: Response) {
    res.cookie('refreshToken', refreshedToken, {
      maxAge: this.configService.get<number>('REFRESH_TOKEN_EXPIRING_HOURS') * 60 * 60 * 1000,
      httpOnly: true,
      signed: true,
      secure: true,
    })
    
    res.status(201).send({
      user: user,
      accessToken: accessToken,
      message: "Token refreshed successfully",
    });
  }
}
