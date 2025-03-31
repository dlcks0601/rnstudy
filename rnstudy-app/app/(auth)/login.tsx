// app/(auth)/login/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '../../src/api/axios';
import * as SecureStore from 'expo-secure-store';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// 스플래시 스크린이 자동으로 숨겨지는 것을 방지
SplashScreen.preventAutoHideAsync();

export default function LocalLogin(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isLoggedIn, login, checkLoginStatus } = useAuthStore();

  const [fontsLoaded] = useFonts({
    Pretendard: require('../../assets/fonts/Pretendard-Regular.otf'),
    AvantGarde: require('../../assets/fonts/ITC Avant Garde Gothic LT Book.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;

      if (accessToken && refreshToken && user) {
        await Promise.all([
          SecureStore.setItemAsync('accessToken', accessToken),
          SecureStore.setItemAsync('refreshToken', refreshToken),
        ]);
        await login(user);
        Alert.alert('로그인 성공', '환영합니다!');
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert(
        '로그인 실패',
        error.response?.data?.message ||
          '아이디나 비밀번호가 올바르지 않습니다.'
      );
    }
  };

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <View className='flex-1 justify-center items-center bg-white px-6'>
      <Text className='font-avant text-5xl mb-8'>tagup</Text>
      <Text className='font-extralight text-lg mb-8'>직관친구가 필요할 땐</Text>
      {!isLoggedIn && (
        <>
          <TextInput
            placeholder='이메일'
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            className='w-full border border-gray-300 rounded-lg px-4 py-3 mb-4'
          />
          <TextInput
            placeholder='비밀번호'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className='w-full border border-gray-300 rounded-lg px-4 py-3 mb-6'
          />
          <TouchableOpacity
            onPress={handleLogin}
            className='bg-blue-500 py-3 px-6 rounded-xl w-full mb-4'
          >
            <Text className='text-white text-center font-medium'>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/register')}
            className='py-3'
          >
            <Text className='text-blue-500'>계정이 없으신가요? 회원가입</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
