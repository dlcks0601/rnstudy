import { Tabs } from 'expo-router';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';

export default function TabLayout() {
  const { logout } = useAuthStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: '홈',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 15,
  },
  logoutText: {
    color: '#007AFF',
  },
});
