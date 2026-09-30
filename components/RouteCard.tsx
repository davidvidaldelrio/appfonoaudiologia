import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Route } from '@/services/practice';

export function RouteCard({ route, progress, onPress }: { route: Route; progress?: number; onPress?: () => void }) {
  const routeProgress = progress ?? route.progress;
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { backgroundColor: route.color }, pressed && styles.pressed]}>
    <View style={styles.icon}><Text style={styles.iconText}>{route.icon}</Text></View>
    <View style={styles.body}><Text style={styles.title}>{route.title}</Text><Text style={styles.description}>{route.description}</Text>
      <View style={styles.progressTrack}><View style={[styles.progress, { width: `${routeProgress * 100}%` }]} /></View>
    </View><Text style={styles.arrow}>›</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, padding: 16, marginBottom: 12 },
  pressed: { opacity: 0.75 }, icon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFFAA', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  iconText: { color: Colors.primary, fontSize: 22 }, body: { flex: 1 }, title: { color: Colors.ink, fontSize: 16, fontWeight: '700' }, description: { color: Colors.muted, fontSize: 12, marginTop: 3 },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: '#FFFFFFAA', marginTop: 10, overflow: 'hidden' }, progress: { height: '100%', borderRadius: 3, backgroundColor: Colors.primary }, arrow: { color: Colors.primary, fontSize: 28, marginLeft: 10 },
});
