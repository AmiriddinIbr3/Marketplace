import { Observable } from "rxjs";
import { ISendSmsOnPhoneArgs } from "../requests/sms";
import { ISendedSms } from "../responses/sms";

export interface SmsImplementation {
    SendSmsOnPhone (request: ISendSmsOnPhoneArgs): Observable<ISendedSms>;
}