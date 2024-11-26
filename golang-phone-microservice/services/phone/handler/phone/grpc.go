package handler

import (
	"context"
	"golang-phone-microservice/services/common/genproto/phone"
	"golang-phone-microservice/services/phone/types"

	"google.golang.org/grpc"
)

type PhoneGrpcHandler struct {
	phoneService types.PhoneService
	phone.UnimplementedPhoneServiceServer
}

func NewGRPCPhoneService(grpcServer *grpc.Server, phoneService types.PhoneService) {
	handler := &PhoneGrpcHandler{
		phoneService: phoneService,
	}
	phone.RegisterPhoneServiceServer(grpcServer, handler)
}

func (h *PhoneGrpcHandler) CheckPhone(ctx context.Context, req *phone.ValidPhoneByNumber) (*phone.ValidatedPhone, error) {
	return h.phoneService.CheckPhone(ctx, req)
}
