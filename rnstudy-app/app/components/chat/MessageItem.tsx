import React from 'react';
import { View, Text } from 'react-native';

interface MessageItemProps {
  content: string;
  userName: string;
  timestamp: Date;
  isMyMessage: boolean;
}

export function MessageItem({
  content,
  userName,
  timestamp,
  isMyMessage,
}: MessageItemProps) {
  return (
    <View className={`my-2 ${isMyMessage ? 'items-end' : 'items-start'}`}>
      <Text className='text-xs mb-1 text-gray-600'>{userName}</Text>
      <View
        className={`p-3 rounded-lg max-w-[80%] ${
          isMyMessage ? 'bg-blue-500' : 'bg-gray-200'
        }`}
      >
        <Text
          className={`text-sm ${isMyMessage ? 'text-white' : 'text-gray-800'}`}
        >
          {content}
        </Text>
      </View>
      <Text className='text-xs mt-1 text-gray-500'>
        {new Date(timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );
}
