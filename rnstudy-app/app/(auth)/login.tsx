import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { api } from '../../src/api/axios';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        // 토큰 저장
        await SecureStore.setItemAsync('token', response.data.token);
        Alert.alert('로그인 성공', '환영합니다!');
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('로그인 실패', '아이디나 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <View className='flex-1 justify-center items-center bg-white px-6'>
      <Text className='text-2xl font-bold mb-8'>rnstudy</Text>
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
        <Text className='text-white text-center font-semibold'>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/register')}
        className='py-3'
      >
        <Text className='text-blue-500'>계정이 없으신가요? 회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}
