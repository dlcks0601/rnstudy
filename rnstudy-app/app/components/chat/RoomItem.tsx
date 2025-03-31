import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface RoomItemProps {
  name: string;
  participantsCount: number;
  onPress: () => void;
}

export default function RoomItem({
  name,
  participantsCount,
  onPress,
}: RoomItemProps) {
  return (
    <TouchableOpacity
      className='p-4 border-b border-gray-200'
      onPress={onPress}
    >
      <Text className='text-lg font-bold'>{name}</Text>
      <Text className='text-gray-500 mt-1'>참여자: {participantsCount}명</Text>
    </TouchableOpacity>
  );
}
