import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { PhoneImplementation } from 'grpc/types/implementations/phone';
import { SmsImplementation } from 'grpc/types/implementations/sms';
import { catchError, firstValueFrom } from 'rxjs';
import { IValidatedPhone } from './types/responses/phone';
import { ISendedSms } from './types/responses/sms';

@Injectable()
export class GRPCService implements OnModuleInit {
    private phoneImplementation: PhoneImplementation;
    private smsImplementation: SmsImplementation;

    @Inject('PHONE_GRPC_PACKAGE')
    private readonly phoneService: ClientGrpc;
    
    @Inject('SMS_GRPC_PACKAGE')
    private readonly smsService: ClientGrpc;

    public onModuleInit(): void {
        this.phoneImplementation = this.phoneService.getService<PhoneImplementation>('PhoneService');
        this.smsImplementation = this.smsService.getService<SmsImplementation>('SmsService');
    }

    public async checkPhone(phone: string): Promise<IValidatedPhone> {
        const result: IValidatedPhone = await firstValueFrom(
            this.phoneImplementation.checkPhone({
                phoneNumber: phone,
            }).pipe(
                catchError(error => {
                    if (error.code && error.code === 14) {
                        console.log(error.details);
                        throw new BadRequestException("Server can\'t handle your request");
                    }
    
                    throw new BadRequestException(error.details);
                }),
            )
        )
    
        if (!result.valid) {
            throw new BadRequestException("Number is not valid");
        }
    
        return result;
    }

    public async sendSmsOnPhone(phone: string, message: string): Promise<ISendedSms> {
        const result: ISendedSms = await firstValueFrom(
            this.smsImplementation.SendSmsOnPhone({
                phoneNumber: phone,
                message,
            }).pipe(
                catchError(error => {
                    if (error.code && error.code === 14) {
                        console.log(error.details);
                        throw new BadRequestException("Server can\'t handle your request");
                    }
    
                    throw new BadRequestException(error.details);
                }),
            )
        )
    
        return result;
    }
}