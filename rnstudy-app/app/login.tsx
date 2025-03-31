// app/(auth)/login/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '../api/axios';
import * as SecureStore from 'expo-secure-store';

export default function LocalLogin(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { isLoggedIn, login, register, logout, checkLoginStatus } =
    useAuthStore();

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

  const handleRegister = async () => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        name,
      });

      const { accessToken, refreshToken, user } = response.data;
      if (accessToken && refreshToken && user) {
        await Promise.all([
          SecureStore.setItemAsync('accessToken', accessToken),
          SecureStore.setItemAsync('refreshToken', refreshToken),
        ]);
        await register(user);
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

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('로그아웃', '로그아웃되었습니다.');
      router.replace('/login');
    } catch (error) {
      Alert.alert('로그아웃 실패', '로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <View className='flex-1 justify-center items-center bg-white px-6'>
      <Text className='text-2xl font-bold mb-8'>rnstudy</Text>
      {!isLoggedIn && (
        <>
          {isRegistering && (
            <TextInput
              placeholder='이름'
              value={name}
              onChangeText={setName}
              className='w-full border border-gray-300 rounded-lg px-4 py-3 mb-4'
            />
          )}
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
        </>
      )}
      <TouchableOpacity
        onPress={
          isLoggedIn
            ? handleLogout
            : isRegistering
            ? handleRegister
            : handleLogin
        }
        className='bg-blue-500 py-3 px-6 rounded-xl w-full mb-4'
      >
        <Text className='text-white text-center font-semibold'>
          {isLoggedIn ? '로그아웃' : isRegistering ? '회원가입' : '로그인'}
        </Text>
      </TouchableOpacity>
      {!isLoggedIn && (
        <TouchableOpacity
          onPress={() => setIsRegistering(!isRegistering)}
          className='py-3'
        >
          <Text className='text-blue-500'>
            {isRegistering
              ? '이미 계정이 있으신가요? 로그인'
              : '계정이 없으신가요? 회원가입'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
