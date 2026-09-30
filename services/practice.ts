import { Goal } from '@/services/onboarding';

export type PracticeDomain = 'habla' | 'lenguaje' | 'voz' | 'memoria' | 'estimulacion' | 'lectura';

export type Route = {
  id: string;
  domain: PracticeDomain;
  title: string;
  description: string;
  progress: number;
  color: string;
  icon: string;
};

export const starterRoutes: Route[] = [
  { id: 'pronunciacion', domain: 'habla', title: 'Pronunciación', description: 'Sonidos claros y seguros', progress: 0.7, color: '#EAF5FF', icon: '◉' },
  { id: 'vocabulario', domain: 'lenguaje', title: 'Vocabulario', description: 'Palabras para comunicarte mejor', progress: 0.45, color: '#FFF3DF', icon: '✦' },
  { id: 'respiracion', domain: 'voz', title: 'Respiración y voz', description: 'Control, ritmo y proyección', progress: 0.2, color: '#E9F9F3', icon: '≈' },
  { id: 'memoria', domain: 'memoria', title: 'Memoria y atención', description: 'Activa tu atención cada día', progress: 0.15, color: '#F4EEFF', icon: '✧' },
  { id: 'lectura', domain: 'lectura', title: 'Lectura', description: 'Comprende y expresa ideas', progress: 0.1, color: '#EAF8F5', icon: '▤' },
];

export function calculateLevel(score: number): number {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  return 1;
}

export function getRecommendedRoute(goals: Goal[]): Route {
  const route = starterRoutes.find((candidate) => goals.some((goal) => {
    const domainByGoal: Partial<Record<Goal, PracticeDomain>> = {
      pronunciation: 'habla',
      language: 'lenguaje',
      voice: 'voz',
      memory: 'memoria',
      reading: 'lectura',
    };
    return domainByGoal[goal] === candidate.domain;
  }));

  return route ?? starterRoutes[0];
}
