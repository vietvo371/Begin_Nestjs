import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
  private users: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const username = this.users.get(client.id);
    this.users.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
    if (username) {
      this.server.emit('userLeft', { username });
    }
  }

  @SubscribeMessage('setUsername')
  handleSetUsername(
    @ConnectedSocket() client: Socket,
    @MessageBody() username: string,
  ) {
    this.users.set(client.id, username);
    this.server.emit('userJoined', { username });
    return { status: 'ok' };
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ) {
    const username = this.users.get(client.id);
    if (!username) return;

    this.server.emit('newMessage', {
      username,
      message,
      timestamp: new Date().toISOString(),
    });
  }
} 