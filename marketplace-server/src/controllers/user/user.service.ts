import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SendUserDto } from './dto/send-user.dto';
import { plainToInstance } from 'class-transformer';

import { userTokenPayload } from 'src/types/token-types';

import { PrismaService } from 'prisma/prisma.service';
import { MailService } from 'src/services/mail/mail.service';
import { JWTService } from 'src/services/jwt/jwt.service';
import { UserDatabaseService } from 'src/services/PrismaDB/user/user-database.service';
import { TokenDatabaseService } from 'src/services/PrismaDB/token/token-database.service';
import { ActivationLinkDatabaseService } from 'src/services/PrismaDB/activationLink/activationLink-database.service';
import { ConfigService } from '@nestjs/config';
import { GRPCService } from 'grpc/GRPC.service';
import { ImageDatabaseService } from 'src/services/PrismaDB/image/image-database.service';
import { ProfileDatabaseService } from 'src/services/PrismaDB/profile/profile-database.service';

import bcrypt from 'bcryptjs';
import { generateActivationLinkUrl } from 'src/helpers/activationLink';

import { Token, User } from '@prisma/client';
import { create } from 'src/helpers/file/file';
import { INoticeSend, NoticeDatabaseService } from 'src/services/PrismaDB/notice/notice-database.service';

@Injectable()
export class UserService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly userDatabase: UserDatabaseService,
    private readonly tokenDatabase: TokenDatabaseService,
    private readonly activationLinkDatabase: ActivationLinkDatabaseService,
    private readonly mailService: MailService,
    private readonly jwtService: JWTService,
    private readonly imageDatabase: ImageDatabaseService,
    private readonly profileDatabase: ProfileDatabaseService,
    private readonly noticeDatabase: NoticeDatabaseService,
    @Inject(GRPCService) private readonly grpcService: GRPCService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    ip: string,
  ) {
    const { email, username, phone } = createUserDto;

    const existingUsername = await this.userDatabase.findUserByUsername(username);
    if (existingUsername) {
      throw new BadRequestException('User with this username already exists');
    }

    const existingEmail = await this.userDatabase.findUserByEmail(email);
    if (existingEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    const ipCount = await this.userDatabase.checkIpCount(ip);
    if (ipCount > 5) {
      throw new BadRequestException('You have already registered several accounts');
    }

    const { countryCode, valid } = await this.grpcService.checkPhone(phone);
    if (!valid) {
      throw new BadRequestException('Number is not valid');
    }

    const existingPhone = await this.userDatabase.isPhoneAndCountryCodeUnique(phone, countryCode);
    if (existingPhone) {
      throw new BadRequestException('User with this phone already exists');
    }

    const user = await this.userDatabase.createUser({
      ...createUserDto,
      ip,
      role: "USER",
      countryCode,
    });

    const tokenPayload: userTokenPayload = await this.jwtService.transformAndValidate(user);

    const { activationLink, url } = generateActivationLinkUrl(`${this.config.get<string>('API_URL')}:${this.config.get<string>('API_PORT')}`);
    await this.mailService.sendActivationLinkUrl(user.id, user.email, url);
    await this.activationLinkDatabase.saveOrUpdateByUserId(user.id, activationLink);

    const { accessToken, refreshedToken } = this.jwtService.generateTokens({...tokenPayload});
    await this.tokenDatabase.saveOrUpdateByUserId(user.id, refreshedToken);

    return { user, accessToken, refreshedToken, activationLink }
  }

  async login(
    loginUserDto: LoginUserDto,
  ) {
    const { password, email, username, phone, countryCode } = loginUserDto;
    
    let user;
    if(email) {
      const existingEmail = await this.userDatabase.findUserByEmail(email);
      
      if (!existingEmail) {
        throw new BadRequestException('No user found with this email');
      }

      user = existingEmail;
    }
    else if(username) {
      const existingUsername = await this.userDatabase.findUserByUsername(username);
      if (!existingUsername) {
        throw new BadRequestException('No user found with this username');
      }

      user = existingUsername;
    }
    else if(phone && countryCode) {
      const existingPhone = await this.userDatabase.findUserByPhone(phone, countryCode);
      if (!existingPhone) {
        throw new BadRequestException('No user found with this phone');
      }

      user = existingPhone;
    }
    
    const isPasswordEquals = await bcrypt.compare(password, user.password);
    if (!isPasswordEquals) {
      throw new BadRequestException('Wrong password');
    }

    const tokenPayload: userTokenPayload = await this.jwtService.transformAndValidate(user);

    const { accessToken, refreshedToken } = this.jwtService.generateTokens({...tokenPayload});
    await this.tokenDatabase.saveOrUpdateByUserId(user.id, refreshedToken);
    
    return { user, accessToken, refreshedToken }
  }

  async logout(refreshToken: Token) {
    await this.tokenDatabase.deleteRefreshToken(refreshToken.id);
  }

  async getNotices(userId: string) {
    const notices: INoticeSend[] = await this.noticeDatabase.findNoticesByUserId(userId);
    
    return notices;
  }

  async addAvatar(userId: string, avatar: Express.Multer.File, uploadDir: string) {
    const createdAvatar = await create(uploadDir, avatar);

    const avatarModel = await this.imageDatabase.createByUserId(userId, createdAvatar);

    const profile = await this.profileDatabase.findAvatars(userId);
    if (!profile) {
      await this.profileDatabase.createProfile(userId, undefined, [
        avatarModel.id,
      ]);
    }
    else {
      await this.profileDatabase.addAvatar(userId, avatarModel.id);
    }
  }

  async refreshToken(user: User) {
    const tokenPayload: userTokenPayload = await this.jwtService.transformAndValidate(user);

    const { accessToken, refreshedToken } = this.jwtService.generateTokens({...tokenPayload});
    await this.tokenDatabase.saveOrUpdateByUserId(user.id, refreshedToken);
    
    return { accessToken, refreshedToken }
  }

  async activate(link: string) {
    const activationLinkWithUser = await this.activationLinkDatabase.findActivateLinkWithUser(link);
    if(!activationLinkWithUser) {
      throw new BadRequestException("Incorrect activation link");
    }

    const { userId } = activationLinkWithUser;

    this.userDatabase.changeEmailActivation(userId, true);
  }

  async getOneUser(id: string): Promise<SendUserDto> {
    const user = await this.userDatabase.findUserById(id);
    return plainToInstance(SendUserDto, user);
  }

  async getAllUsers(): Promise<SendUserDto[]> {
    const users = await this.prisma.user.findMany();
    return plainToInstance(SendUserDto, users);
  }

  async getAvatars(userId: string) {
    const profile = await this.profileDatabase.findAvatars(userId);

    if (profile && profile.avatars.length !== 0) {
      const sortedAvatars = profile.avatars.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return sortedAvatars.map(avatar => avatar.id);
    }
    
    return null;
  }
}
