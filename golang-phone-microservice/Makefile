gen:
	@protoc \
		--proto_path=/protobuf \
		/protobuf/phone.proto \
		--go_out=services/common/genproto/phone --go_opt=paths=source_relative \
		--go-grpc_out=services/common/genproto/phone --go-grpc_opt=paths=source_relative \

	@protoc \
		--proto_path=protobuf \
		protobuf/sms.proto \
		--go_out=services/common/genproto/sms --go_opt=paths=source_relative \
		--go-grpc_out=services/common/genproto/sms --go-grpc_opt=paths=source_relative \

run:
	@go run services/phone/main.go