import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessageDto } from './dto/chat-message.dto';
import { CreateRoomDto, JoinRoomDto } from './dto/room.dto';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:8081',
      'http://192.168.45.121:8081',
      'exp://192.168.45.121:8081',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    preflightContinue: false,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<number, Socket> = new Map();

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    for (const [userId, socket] of this.connectedClients.entries()) {
      if (socket.id === client.id) {
        this.connectedClients.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, userId: number) {
    this.connectedClients.set(userId, client);
    console.log(`User ${userId} joined the chat`);
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(client: Socket, data: CreateRoomDto) {
    try {
      const room = await this.chatService.createRoom(data);
      client.join(room.id);
      client.emit('roomCreated', room);
      return room;
    } catch (error) {
      client.emit('error', { message: '채팅방 생성 중 오류가 발생했습니다.' });
      throw error;
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, data: JoinRoomDto) {
    try {
      const room = await this.chatService.joinRoom(data);
      client.join(data.roomId);

      // 이전 메시지 로드
      const messages = await this.chatService.getRoomMessages(data.roomId);
      client.emit('previousMessages', messages);

      this.server.to(data.roomId).emit('roomJoined', {
        room,
        userId: data.userId,
      });

      return room;
    } catch (error) {
      client.emit('error', { message: '채팅방 참여 중 오류가 발생했습니다.' });
      throw error;
    }
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, message: ChatMessageDto) {
    try {
      const savedMessage = await this.chatService.saveMessage(message);
      this.server.to(message.roomId).emit('message', savedMessage);
    } catch (error) {
      client.emit('error', { message: '메시지 전송 중 오류가 발생했습니다.' });
      throw error;
    }
  }

  @SubscribeMessage('getRooms')
  async handleGetRooms(client: Socket) {
    try {
      const rooms = await this.chatService.getRooms();
      client.emit('rooms', rooms);
      return rooms;
    } catch (error) {
      client.emit('error', {
        message: '채팅방 목록을 가져오는 중 오류가 발생했습니다.',
      });
      throw error;
    }
  }

  // 특정 사용자에게 메시지 전송
  sendToUser(userId: number, message: any) {
    const client = this.connectedClients.get(userId);
    if (client) {
      client.emit('message', message);
    }
  }

  // 특정 방의 모든 사용자에게 메시지 전송
  broadcastToRoom(roomId: string, message: any) {
    this.server.to(roomId).emit('message', message);
  }
}
