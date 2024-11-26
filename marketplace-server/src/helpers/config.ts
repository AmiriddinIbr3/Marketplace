import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export const getMailerInfo = async (service: string, config: ConfigService): Promise<MailerOptions> => {
  return {
    transport: {
      host: config.get<string>(`${service}_HOST_SMTP`),
      port: config.get<number>(`${service}_PORT_SMTP`),
      auth: {
        user: config.get<string>(`${service}_MAIL_SMTP`),
        pass: config.get<string>(`${service}_PASS_SMTP`),
      },
    },
  };
};