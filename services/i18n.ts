export const translations = {
  es: {
    appName: 'HáblaMejor',
    greeting: '¡Hola!',
    todayPrompt: '¿Qué quieres practicar hoy?',
    practice: 'Practicar',
    routes: 'Rutas',
    progress: 'Progreso',
    profile: 'Perfil',
    continue: 'Continuar',
    streak: 'Racha actual',
    minutesToday: 'minutos hoy',
    startRoute: 'Comenzar ruta',
  },
} as const;

export type TranslationKey = keyof typeof translations.es;

export function t(key: TranslationKey): string {
  return translations.es[key];
}
