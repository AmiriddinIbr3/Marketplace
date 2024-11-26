import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { UserDatabaseService } from '../PrismaDB/user/user-database.service';
import { possibleMailErrors, Result } from 'src/types/errors-types';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { delay } from 'src/helpers/utils';

@Injectable()
export class MailService {
    constructor(
        @Inject('MAIL_SERVICE') private readonly service: string,
        private readonly userDatabase: UserDatabaseService,
        private readonly mailerService: MailerService,
        private readonly config: ConfigService,
    ) {}

    async sendActivationMail(to: string, url: string): Promise<Result<possibleMailErrors>> {
        try {
            await this.mailerService.sendMail({
                from: this.config.get<string>(`${this.service}_MAIL_SMTP`),
                to: to,
                subject: 'Activation link',
                html: `
                    <p>Your activation link is: 
                        <a href="${url}">${url}</a>
                    </p>
                `,
            });

            return {
                success: true,
                error: null,
            }
        } catch (error) {
            if (error.responseCode === 550) {
                return {
                    success: false,
                    error: new BadRequestException('Invalid mailbox. Please check the email address and try again'),
                }
            } else {
                console.log(error);
                return {
                    success: false,
                    error: new Error('Server can\'t handle your request. Try again'),
                }
            }
        }
    }

    async sendActivationLinkUrl(userId: string, userEmail: string, url: string): Promise<void> {
        const result = await this.sendActivationMail(userEmail, url);
        
        if (!result.success) {
            if (result.error instanceof BadRequestException) {
              await this.userDatabase.deleteUserWithUnlinkActivationKey(userId);
              
              throw result.error;
            }
            else {
                await delay(2);
                const result = await this.sendActivationMail(userEmail, url)
      
                if(!result.success) {
                    await this.userDatabase.deleteUserWithUnlinkActivationKey(userId);
      
                    console.log(result.error);
                    throw result.error;
                }
            }
        }
    }
}