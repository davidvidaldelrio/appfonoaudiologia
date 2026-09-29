import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { RouteCard } from '@/components/RouteCard';
import { Colors } from '@/constants/Colors';
import { starterRoutes } from '@/services/practice';
import { useLearning } from '@/context/LearningContext';

export default function HomeScreen() {
  const { activeProfile, streak, minutesToday } = useLearning();
  return <Screen><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
    <View style={styles.header}><View><Text style={styles.eyebrow}>HÁBLAMEJOR</Text><Text style={styles.greeting}>¡Hola, {activeProfile}! 👋</Text></View><Pressable style={styles.avatar}><Text>☺</Text></Pressable></View>
    <View style={styles.hero}><View style={styles.heroText}><Text style={styles.heroTitle}>Tu voz tiene mucho que decir.</Text><Text style={styles.heroDescription}>Practica un poco cada día y avanza a tu ritmo.</Text><Pressable style={styles.button}><Text style={styles.buttonText}>Continuar práctica</Text></Pressable></View><Text style={styles.heroIcon}>☀</Text></View>
    <View style={styles.stats}><View><Text style={styles.statValue}>{streak}</Text><Text style={styles.statLabel}>días de racha</Text></View><View><Text style={styles.statValue}>{minutesToday}</Text><Text style={styles.statLabel}>minutos hoy</Text></View><View><Text style={styles.statValue}>70%</Text><Text style={styles.statLabel}>progreso</Text></View></View>
    <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Tus rutas</Text><Text style={styles.link}>Ver todas</Text></View>
    {starterRoutes.map((route) => <RouteCard key={route.id} route={route} />)}
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({ scroll: { paddingTop: 20, paddingBottom: 24 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }, eyebrow: { color: Colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 }, greeting: { color: Colors.ink, fontSize: 25, fontWeight: '800', marginTop: 5 }, avatar: { backgroundColor: '#E7E1FF', width: 46, height: 46, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }, hero: { backgroundColor: Colors.primary, borderRadius: 24, padding: 20, flexDirection: 'row', overflow: 'hidden', marginBottom: 16 }, heroText: { flex: 1 }, heroTitle: { color: '#FFF', fontSize: 20, fontWeight: '800', lineHeight: 26 }, heroDescription: { color: '#E5E0FF', fontSize: 13, lineHeight: 19, marginTop: 7 }, button: { backgroundColor: '#FFF', paddingVertical: 11, paddingHorizontal: 14, alignSelf: 'flex-start', borderRadius: 12, marginTop: 16 }, buttonText: { color: Colors.primary, fontWeight: '700', fontSize: 12 }, heroIcon: { color: '#BFB3FF', fontSize: 74, marginTop: 14, marginRight: -12 }, stats: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: Colors.card, borderRadius: 18, paddingVertical: 17, marginBottom: 24 }, statValue: { textAlign: 'center', color: Colors.ink, fontSize: 20, fontWeight: '800' }, statLabel: { textAlign: 'center', color: Colors.muted, fontSize: 11, marginTop: 4 }, sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }, sectionTitle: { color: Colors.ink, fontSize: 19, fontWeight: '800' }, link: { color: Colors.primary, fontSize: 13, fontWeight: '700' }, });
