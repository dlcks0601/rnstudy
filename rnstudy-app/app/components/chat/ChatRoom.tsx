import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { MessageItem } from './MessageItem';
import { MessageInput } from './MessageInput';
import { Message, Room } from '@/app/types/chat';

interface ChatRoomProps {
  room: Room;
  messages: Message[];
  userId: number;
  newMessage: string;
  onChangeMessage: (text: string) => void;
  onSendMessage: () => void;
  onBack: () => void;
}

export function ChatRoom({
  room,
  messages,
  userId,
  newMessage,
  onChangeMessage,
  onSendMessage,
  onBack,
}: ChatRoomProps) {
  return (
    <View className='flex-1'>
      <View className='flex-row justify-between items-center p-4 border-b border-gray-200'>
        <Text className='text-xl font-bold'>{room.name}</Text>
        <TouchableOpacity className='p-2' onPress={onBack}>
          <Text className='text-blue-500 font-semibold'>뒤로</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        className='flex-1 p-4'
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <MessageItem
            content={item.content}
            userName={item.userName}
            timestamp={item.timestamp}
            isMyMessage={item.userId === userId}
          />
        )}
      />
      <MessageInput
        value={newMessage}
        onChangeText={onChangeMessage}
        onSend={onSendMessage}
      />
    </View>
  );
}
