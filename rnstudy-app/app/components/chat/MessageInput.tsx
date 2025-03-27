import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export function MessageInput({
  value,
  onChangeText,
  onSend,
}: MessageInputProps) {
  return (
    <View className='flex-row p-4 border-t border-gray-200'>
      <TextInput
        className='flex-1 border border-gray-300 rounded-lg px-4 py-2 mr-2'
        placeholder='메시지를 입력하세요'
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        className='bg-blue-500 px-4 py-2 rounded-lg justify-center'
        onPress={onSend}
      >
        <Text className='text-white font-semibold'>전송</Text>
      </TouchableOpacity>
    </View>
  );
}
