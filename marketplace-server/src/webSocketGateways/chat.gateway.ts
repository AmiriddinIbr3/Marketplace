import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;

    handleConnection(client: Socket) {
        client.broadcast.emit("user-join", `Hi, I am here! ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        client.broadcast.emit("user-left", `Bye! ${client.id}`);
    }

    @SubscribeMessage('message')
    handleMessage(client: Socket, @MessageBody() message: string) {
        this.server.emit('reply', message);
    }
}