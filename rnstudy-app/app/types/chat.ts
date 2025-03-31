export interface Message {
  userId: number;
  userName: string;
  content: string;
  timestamp: Date;
  createdAt: Date;
}

export interface Room {
  id: string;
  name: string;
  participants: number[];
  createdAt: Date;
}
