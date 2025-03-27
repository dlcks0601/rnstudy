import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, JoinRoomDto } from './dto/room.dto';
import { ChatMessageDto } from './dto/chat-message.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createRoom(data: CreateRoomDto) {
    return this.prisma.room.create({
      data: {
        name: data.name,
        participants: {
          connect: {
            id: data.userId,
          },
        },
      },
      include: {
        participants: true,
      },
    });
  }

  async joinRoom(data: JoinRoomDto) {
    return this.prisma.room.update({
      where: {
        id: data.roomId,
      },
      data: {
        participants: {
          connect: {
            id: data.userId,
          },
        },
      },
      include: {
        participants: true,
      },
    });
  }

  async getRooms() {
    return this.prisma.room.findMany({
      include: {
        participants: true,
      },
    });
  }

  async getRoomMessages(roomId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        roomId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages.map((message) => ({
      ...message,
      userName: message.user.name,
      timestamp: message.createdAt,
    }));
  }

  async saveMessage(data: ChatMessageDto) {
    const message = await this.prisma.message.create({
      data: {
        content: data.content,
        userId: data.userId,
        roomId: data.roomId,
        createdAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      ...message,
      userName: message.user.name,
      timestamp: message.createdAt,
    };
  }
}
