import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LearningProvider } from '@/context/LearningContext';

export default function RootLayout() {
  return <LearningProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false }} /></LearningProvider>;
}
