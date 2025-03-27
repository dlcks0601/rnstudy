import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { api } from '../../src/api/axios';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async () => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        name,
      });

      if (response.data.token) {
        await SecureStore.setItemAsync('token', response.data.token);
        Alert.alert('회원가입 성공', '환영합니다!');
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert(
        '회원가입 실패',
        error.response?.data?.message || '회원가입 중 오류가 발생했습니다.'
      );
    }
  };

  return (
    <View className='flex-1 justify-center items-center bg-white px-6'>
      <Text className='text-2xl font-bold mb-8'>회원가입</Text>
      <TextInput
        placeholder='이름'
        value={name}
        onChangeText={setName}
        className='w-full border border-gray-300 rounded-lg px-4 py-3 mb-4'
      />
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
        onPress={handleRegister}
        className='bg-blue-500 py-3 px-6 rounded-xl w-full mb-4'
      >
        <Text className='text-white text-center font-semibold'>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')} className='py-3'>
        <Text className='text-blue-500'>이미 계정이 있으신가요? 로그인</Text>
      </TouchableOpacity>
    </View>
  );
}
