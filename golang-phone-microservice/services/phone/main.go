package main

import (
	server "golang-phone-microservice/services/phone/servers"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	grpcServer := server.NewGRPCServer(":50051")
	grpcServer.Run()
}
