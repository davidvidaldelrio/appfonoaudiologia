import { PropsWithChildren } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';

export function Screen({ children }: PropsWithChildren) {
  return <SafeAreaView style={styles.safe}><View style={styles.content}>{children}</View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, paddingHorizontal: 20 },
});
