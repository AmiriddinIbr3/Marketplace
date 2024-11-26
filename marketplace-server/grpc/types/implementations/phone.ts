import { Observable } from 'rxjs';
import { IValidatedPhone } from 'grpc/types/responses/phone';
import { IPhoneCheckArgs } from '../requests/phone';

export interface PhoneImplementation {
    checkPhone(request: IPhoneCheckArgs): Observable<IValidatedPhone>;
}