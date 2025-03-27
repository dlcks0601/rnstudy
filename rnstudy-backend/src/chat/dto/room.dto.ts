export class CreateRoomDto {
  name: string;
  userId: number;
}

export class JoinRoomDto {
  roomId: string;
  userId: number;
}

export class Room {
  id: string;
  name: string;
  participants: number[];
  createdAt: Date;
}
