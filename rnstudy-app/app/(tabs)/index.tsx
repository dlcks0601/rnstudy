import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/useAuthStore';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { isLoggedIn, logout, user } = useAuthStore();

  const handleAuth = async () => {
    if (isLoggedIn) {
      await logout();
      router.replace('/login');
    } else {
      router.push('/login');
    }
  };

  const handleTeamSelect = () => {
    router.push('/TeamSelect');
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 items-center justify-center gap-4'>
        <Text className='text-2xl font-bold mb-5'>
          {isLoggedIn ? `${user?.name}님 환영합니다!` : '로그인이 필요합니다'}
        </Text>
        <TouchableOpacity
          className='bg-black px-6 py-3 rounded-xl'
          onPress={handleAuth}
        >
          <Text className='text-white text-base font-semibold'>
            {isLoggedIn ? '로그아웃' : '로그인'}
          </Text>
        </TouchableOpacity>
        {isLoggedIn && (
          <TouchableOpacity
            className='bg-blue-500 px-6 py-3 rounded-xl'
            onPress={handleTeamSelect}
          >
            <Text className='text-white text-base font-semibold'>
              팀 선택하기
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
