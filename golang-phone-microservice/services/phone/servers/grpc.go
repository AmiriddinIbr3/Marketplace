package server

import (
	"log"
	"net"

	phoneHandler "golang-phone-microservice/services/phone/handler/phone"
	smsHandler "golang-phone-microservice/services/phone/handler/sms"

	"golang-phone-microservice/services/phone/service"

	"google.golang.org/grpc"
)

type gRPCServer struct {
	addr string
}

func NewGRPCServer(addr string) *gRPCServer {
	return &gRPCServer{addr: addr}
}

func (s *gRPCServer) Run() error {
	lis, err := net.Listen("tcp", s.addr)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()

	phoneService := service.NewPhoneService()
	phoneHandler.NewGRPCPhoneService(grpcServer, phoneService)

	smsService := service.NewSmsService()
	smsHandler.NewGRPCSmsService(grpcServer, smsService)

	log.Println("Starting gRPC server on", s.addr)

	return grpcServer.Serve(lis)
}
