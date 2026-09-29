import { ScrollView, StyleSheet, Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { RouteCard } from '@/components/RouteCard';
import { starterRoutes } from '@/services/practice';
import { Colors } from '@/constants/Colors';

export default function RoutesScreen() { return <Screen><ScrollView contentContainerStyle={styles.content}><Text style={styles.title}>Rutas de aprendizaje</Text><Text style={styles.subtitle}>Elige una habilidad para comenzar a avanzar.</Text>{starterRoutes.map((route) => <RouteCard key={route.id} route={route} />)}</ScrollView></Screen>; }
const styles = StyleSheet.create({ content: { paddingTop: 24 }, title: { color: Colors.ink, fontSize: 28, fontWeight: '800' }, subtitle: { color: Colors.muted, fontSize: 14, marginTop: 7, marginBottom: 24 } });
