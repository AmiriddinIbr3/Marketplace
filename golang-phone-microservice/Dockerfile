FROM golang

RUN apt-get update
RUN apt-get update && apt-get install -y protobuf-compiler

COPY . /dockerWorkdir

RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN mkdir -p services/common/genproto/phone
RUN protoc \
    --proto_path=/dockerWorkdir/protobuf \
    /dockerWorkdir/protobuf/phone.proto \
    --go_out=services/common/genproto/phone --go_opt=paths=source_relative \
    --go-grpc_out=services/common/genproto/phone --go-grpc_opt=paths=source_relative

RUN mkdir -p services/common/genproto/sms
RUN protoc \
    --proto_path=/dockerWorkdir/protobuf \
    /dockerWorkdir/protobuf/sms.proto \
    --go_out=services/common/genproto/sms --go_opt=paths=source_relative \
    --go-grpc_out=services/common/genproto/sms --go-grpc_opt=paths=source_relative

WORKDIR /dockerWorkdir

RUN go build -o main ./services/phone

EXPOSE 50051

CMD ["./main"]