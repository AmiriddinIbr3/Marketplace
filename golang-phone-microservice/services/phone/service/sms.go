package service

import (
	"context"
	"golang-phone-microservice/services/common/genproto/sms"
	"os"

	twilio "github.com/twilio/twilio-go"
	openapi "github.com/twilio/twilio-go/rest/api/v2010"
)

type SmsService struct{}

func NewSmsService() *SmsService {
	return &SmsService{}
}

func (s *SmsService) SendSmsOnPhone(ctx context.Context, req *sms.SendSmsOnNumber) (*sms.SendedSms, error) {
	number := req.PhoneNumber
	message := req.Message
	fromNumber := os.Getenv("TWILIO_PHONE_NUMBER")

	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: os.Getenv("TWILIO_ACCOUNT_SID"),
		Password: os.Getenv("TWILIO_AUTH_TOKEN"),
	})

	params := &openapi.CreateMessageParams{
		To:   &number,
		From: &fromNumber,
		Body: &message,
	}

	_, err := client.Api.CreateMessage(params)
	if err != nil {
		return &sms.SendedSms{
			PhoneNumber: number,
			Sended:      false,
		}, err
	} else {
		return &sms.SendedSms{
			PhoneNumber: number,
			Sended:      true,
		}, nil
	}
}
