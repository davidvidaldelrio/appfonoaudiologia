import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '@/constants/Colors';

export function BottomTabBar() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.muted,
      tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 8 },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: () => <Text>⌂</Text> }} />
      <Tabs.Screen name="routes" options={{ title: 'Rutas', tabBarIcon: () => <Text>♧</Text> }} />
      <Tabs.Screen name="practice" options={{ title: 'Practicar', tabBarIcon: () => <Text>●</Text> }} />
      <Tabs.Screen name="progress" options={{ title: 'Progreso', tabBarIcon: () => <Text>▥</Text> }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: () => <Text>●</Text> }} />
    </Tabs>
  );
}
