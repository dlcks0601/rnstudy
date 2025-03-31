import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import '../global.css';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const segments = useSegments();
  const router = useRouter();
  const { isLoggedIn, checkLoginStatus } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await checkLoginStatus();
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (isLoading || !loaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/login');
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments, isLoading, loaded]);

  if (!loaded || isLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='login' />
        <Stack.Screen name='(tabs)' />
      </Stack>
    </SafeAreaProvider>
  );
}
