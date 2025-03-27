import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { io } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Message, Room } from '../types/chat';
import { RoomList } from '../components/chat/RoomList';
import { ChatRoom } from '../components/chat/ChatRoom';

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [newRoomName, setNewRoomName] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const newSocket = io('http://192.168.45.121:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsLoading(false);
      newSocket.emit('join', user.id);
      newSocket.emit('getRooms');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      Alert.alert('연결 오류', '서버에 연결할 수 없습니다. 다시 시도해주세요.');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    newSocket.on('message', (message: Message) => {
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          timestamp: new Date(message.timestamp || message.createdAt),
        },
      ]);
    });

    newSocket.on('rooms', (rooms: Room[]) => {
      setRooms(rooms);
    });

    newSocket.on('roomCreated', (room: Room) => {
      setRooms((prev) => [...prev, room]);
      setCurrentRoom(room);
    });

    newSocket.on('roomJoined', ({ room, userId }) => {
      setCurrentRoom(room);
    });

    newSocket.on('previousMessages', (messages: Message[]) => {
      setMessages(
        messages.map((message) => ({
          ...message,
          timestamp: new Date(message.timestamp || message.createdAt),
        }))
      );
    });

    newSocket.on('error', (error: { message: string }) => {
      Alert.alert('오류', error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  const createRoom = () => {
    if (!newRoomName.trim() || !user) return;
    socket.emit('createRoom', {
      name: newRoomName,
      userId: user.id,
    });
    setNewRoomName('');
  };

  const joinRoom = (roomId: string) => {
    if (!user) return;
    socket.emit('joinRoom', {
      roomId,
      userId: user.id,
    });
  };

  const goBack = () => {
    setCurrentRoom(null);
    router.back();
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !currentRoom || !user) return;
    socket.emit('message', {
      userId: user.id,
      content: newMessage,
      roomId: currentRoom.id,
    });
    setNewMessage('');
  };

  if (isLoading) {
    return (
      <SafeAreaView
        className='flex-1 bg-white justify-center items-center'
        edges={['top']}
      >
        <ActivityIndicator size='large' color='#007AFF' />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top']}>
      {!currentRoom ? (
        <RoomList
          rooms={rooms}
          newRoomName={newRoomName}
          onChangeRoomName={setNewRoomName}
          onCreateRoom={createRoom}
          onJoinRoom={joinRoom}
        />
      ) : (
        <ChatRoom
          room={currentRoom}
          messages={messages}
          userId={user?.id || 0}
          newMessage={newMessage}
          onChangeMessage={setNewMessage}
          onSendMessage={sendMessage}
          onBack={goBack}
        />
      )}
    </SafeAreaView>
  );
}
