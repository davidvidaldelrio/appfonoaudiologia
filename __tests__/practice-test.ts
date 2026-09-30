import { calculateLevel, getRecommendedRoute } from '@/services/practice';
import { initialProgress, getDailyGoalProgress, getOverallProgress, recordPractice, resetDailyProgress } from '@/services/progress';
import { getAchievements, getLevel, getLevelProgress } from '@/services/achievements';

describe('practice', () => {
  it('calcula el nivel según el puntaje', () => {
    expect(calculateLevel(95)).toBe(3);
    expect(calculateLevel(70)).toBe(2);
    expect(calculateLevel(40)).toBe(1);
  });

  it('recomienda la primera ruta disponible según los objetivos', () => {
    expect(getRecommendedRoute(['voice']).id).toBe('respiracion');
    expect(getRecommendedRoute(['reading']).id).toBe('lectura');
    expect(getRecommendedRoute([]).id).toBe('pronunciacion');
  });

  it('persiste puntuación, sesiones, XP y racha en días consecutivos', () => {
    const firstDay = recordPractice(initialProgress, 'pronunciacion', 86, new Date('2026-09-29T12:00:00Z'));
    const secondDay = recordPractice(firstDay, 'pronunciacion', 82, new Date('2026-09-30T12:00:00Z'));
    expect(secondDay.currentStreak).toBe(2);
    expect(secondDay.minutesToday).toBe(1);
    expect(secondDay.xp).toBe(84);
    expect(secondDay.sessions).toHaveLength(2);
    expect(secondDay.routeScores.pronunciacion).toBe(86);
    expect(getOverallProgress(secondDay)).toBe(86);
  });

  it('acumula los minutos del mismo día y limita el historial', () => {
    let progress = initialProgress;
    for (let index = 0; index < 21; index += 1) {
      progress = recordPractice(progress, 'vocabulario', 60, new Date(`2026-09-29T${String(index).padStart(2, '0')}:00:00Z`));
    }
    expect(progress.minutesToday).toBe(21);
    expect(progress.sessions).toHaveLength(20);
  });

  it('calcula nivel y desbloquea logros por progreso', () => {
    const progress = [1, 2, 3].reduce((current, score) => recordPractice(current, 'vocabulario', score * 50, new Date('2026-09-29T12:00:00Z')), initialProgress);
    expect(getLevel(progress.xp)).toBe(2);
    expect(getLevelProgress(progress.xp)).toBe(50);
    expect(getAchievements(progress).find((achievement) => achievement.id === 'three-sessions')?.unlocked).toBe(true);
  });

  it('limita el avance de la meta diaria al cien por ciento', () => {
    expect(getDailyGoalProgress(0)).toBe(0);
    expect(getDailyGoalProgress(5)).toBe(50);
    expect(getDailyGoalProgress(12)).toBe(100);
  });

  it('reinicia los minutos al cargar un día diferente', () => {
    const previousDay = recordPractice(initialProgress, 'lectura', 80, new Date('2026-09-28T12:00:00Z'));
    expect(resetDailyProgress(previousDay, new Date('2026-09-29T08:00:00Z')).minutesToday).toBe(0);
    expect(resetDailyProgress(previousDay, new Date('2026-09-28T18:00:00Z')).minutesToday).toBe(1);
  });
});
