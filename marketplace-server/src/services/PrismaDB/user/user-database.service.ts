import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ActivationLinkDatabaseService } from '../activationLink/activationLink-database.service';
import bcrypt from 'bcryptjs';
import { ICreateUserDB } from './interfaces';

@Injectable()
export class UserDatabaseService {
    constructor(
        private readonly activationLinkDatabase: ActivationLinkDatabaseService,
        private readonly prisma: PrismaService
    ) {}

    async findUserById(userId: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                products: true,
                profile: true,
                images: true,
                likes: true,
            }
        });
    }
    
    async findUserByUsername(username: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                username,
            }
        });
    }
    
    async findUserByEmail(email: string): Promise<User | null>  {
        return await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async findUserByPhone(phone: string, countryCode: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                phone_countryCode: {
                    phone,
                    countryCode,
                },
            },
        });
    }
    
    async deleteUserById(userId: string): Promise<void> {
        try {
            await this.prisma.user.delete({
                where: {
                    id: userId,
                }
            });
        } catch(error) {
            console.log(error);
            throw new Error('Error during deleting user');
        }
    }

    async checkIpCount(ip: string): Promise<number> {
        return await this.prisma.user.count({
            where: {
                ip: ip,
            },
        });
    }
    
    async deleteUserWithUnlinkActivationKey(userId: string): Promise<void> {
        try {
            this.activationLinkDatabase.deleteByUserId(userId);

            this.deleteUserById(userId)
        } catch(error) {
            console.log(error);
            throw new Error('Error during deleting user and activation link');
        }
    }

    async createUser(createUserDB: ICreateUserDB) {
        let { email, password, name, username, surname, phone, countryCode, ip, role } = createUserDB;

        if  (!surname) {
            surname = '.';
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
        
            return await this.prisma.user.create({
                data: {
                    phone,
                    countryCode,
                    ip,
                    role,
                    email,
                    name,
                    surname,
                    username,
                    password: hashedPassword,
                    isActivated: false,
                },
            });
        } catch(error) {
            console.log(error);
            throw new Error('Error during creating user');
        }
    }

    async changeEmailActivation(userId: string, isActivated: boolean): Promise<User> {
        try {
            return await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    isActivated: isActivated
                },
            });
        } catch(error) {
            console.log(error);
            throw new Error('Error during activation user email');
        }
    }

    async isPhoneAndCountryCodeUnique(phone: string, countryCode: string): Promise<User | null> {
        try {
            return await this.prisma.user.findUnique({
                where: {
                    phone_countryCode: {
                        phone,
                        countryCode,
                    },
                },
            });
        } catch (error) {
            console.log(error);
            throw new Error('Error checking uniqueness');
        }
    }
}