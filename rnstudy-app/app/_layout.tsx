import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import '../global.css';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const segments = useSegments();
  const router = useRouter();
  const { isLoggedIn, checkLoginStatus } = useAuthStore();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const inLoginPage = segments[0] === 'login';

    if (!isLoggedIn && !inLoginPage) {
      // 로그인되지 않은 상태에서 로그인 페이지가 아닌 곳으로 접근 시
      router.replace('/login');
    } else if (isLoggedIn && inLoginPage) {
      // 로그인된 상태에서 로그인 페이지로 접근 시
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, loaded, segments]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='login' />
      <Stack.Screen name='(tabs)' />
    </Stack>
  );
}
