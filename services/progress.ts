export type ProgressState = {
  minutesToday: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  routeScores: Record<string, number>;
  sessions: PracticeSession[];
};

export type PracticeSession = {
  routeId: string;
  score: number;
  xp: number;
  date: string;
};

export const initialProgress: ProgressState = {
  minutesToday: 0,
  xp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastPracticeDate: null,
  routeScores: {},
  sessions: [],
};

export function recordPractice(state: ProgressState, routeId: string, score: number, date = new Date()): ProgressState {
  const practiceDate = toDateKey(date);
  const daysSinceLastPractice = state.lastPracticeDate ? daysBetween(state.lastPracticeDate, practiceDate) : null;
  const currentStreak = daysSinceLastPractice === 1 ? state.currentStreak + 1 : daysSinceLastPractice === 0 ? state.currentStreak : 1;
  const sessionXp = Math.max(10, Math.round(score / 2));
  const minutesToday = daysSinceLastPractice === 0 ? state.minutesToday + 1 : 1;

  return {
    ...state,
    minutesToday,
    xp: state.xp + sessionXp,
    currentStreak,
    longestStreak: Math.max(state.longestStreak, currentStreak),
    lastPracticeDate: practiceDate,
    routeScores: { ...state.routeScores, [routeId]: Math.max(state.routeScores[routeId] ?? 0, score) },
    sessions: [...state.sessions, { routeId, score, xp: sessionXp, date: practiceDate }].slice(-20),
  };
}

export function getOverallProgress(state: ProgressState): number {
  const scores = Object.values(state.routeScores);
  return scores.length ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length) : 0;
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function daysBetween(start: string, end: string): number {
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  return Math.round((endDate.getTime() - startDate.getTime()) / 86400000);
}

export function getDailyGoalProgress(minutesToday: number, targetMinutes = 10): number {
  if (targetMinutes <= 0) return 100;
  return Math.min(100, Math.round((minutesToday / targetMinutes) * 100));
}

export function resetDailyProgress(state: ProgressState, date = new Date()): ProgressState {
  const currentDate = toDateKey(date);
  if (!state.lastPracticeDate || state.lastPracticeDate === currentDate) return state;
  return { ...state, minutesToday: 0 };
}