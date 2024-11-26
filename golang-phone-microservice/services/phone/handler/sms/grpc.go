package handler

import (
	"context"
	"golang-phone-microservice/services/common/genproto/sms"
	"golang-phone-microservice/services/phone/types"

	"google.golang.org/grpc"
)

type SmsGrpcHandler struct {
	smsService types.SmsService
	sms.UnimplementedSmsServiceServer
}

func NewGRPCSmsService(grpcServer *grpc.Server, smsService types.SmsService) {
	handler := &SmsGrpcHandler{
		smsService: smsService,
	}
	sms.RegisterSmsServiceServer(grpcServer, handler)
}

func (h *SmsGrpcHandler) SendSmsOnPhone(ctx context.Context, req *sms.SendSmsOnNumber) (*sms.SendedSms, error) {
	return h.smsService.SendSmsOnPhone(ctx, req)
}
