import { ProgressState } from '@/services/progress';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

export function getLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getLevelProgress(xp: number): number {
  return xp % 100;
}

export function getAchievements(progress: ProgressState): Achievement[] {
  return [
    { id: 'first-practice', title: 'Primera práctica', description: 'Completa tu primera actividad.', unlocked: progress.sessions.length >= 1 },
    { id: 'three-sessions', title: 'Constancia', description: 'Completa tres actividades.', unlocked: progress.sessions.length >= 3 },
    { id: 'week-streak', title: 'Una semana', description: 'Mantén una racha de siete días.', unlocked: progress.longestStreak >= 7 },
    { id: 'five-hundred-xp', title: 'En marcha', description: 'Consigue 500 XP.', unlocked: progress.xp >= 500 },
  ];
}