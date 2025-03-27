import React from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RoomItem } from './RoomItem';
import { Room } from '@/app/types/chat';

interface RoomListProps {
  rooms: Room[];
  newRoomName: string;
  onChangeRoomName: (text: string) => void;
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
}

export function RoomList({
  rooms,
  newRoomName,
  onChangeRoomName,
  onCreateRoom,
  onJoinRoom,
}: RoomListProps) {
  return (
    <KeyboardAvoidingView
      className='flex-1'
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View className='flex-1 p-4'>
        <View className='flex-row mb-4'>
          <TextInput
            className='flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-2'
            placeholder='새 채팅방 이름'
            value={newRoomName}
            onChangeText={onChangeRoomName}
          />
          <TouchableOpacity
            className='bg-blue-500 px-4 py-2 rounded-lg justify-center'
            onPress={onCreateRoom}
          >
            <Text className='text-white font-semibold'>만들기</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RoomItem
              name={item.name}
              participantsCount={item.participants.length}
              onPress={() => onJoinRoom(item.id)}
            />
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
