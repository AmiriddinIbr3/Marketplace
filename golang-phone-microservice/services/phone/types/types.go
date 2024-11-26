package types

import (
	"context"
	"golang-phone-microservice/services/common/genproto/phone"
	"golang-phone-microservice/services/common/genproto/sms"
)

type PhoneService interface {
	CheckPhone(context.Context, *phone.ValidPhoneByNumber) (*phone.ValidatedPhone, error)
}

type SmsService interface {
	SendSmsOnPhone(context.Context, *sms.SendSmsOnNumber) (*sms.SendedSms, error)
}
