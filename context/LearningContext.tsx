import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LocalProfile } from '@/services/onboarding';
import { initialProgress, ProgressState, recordPractice as savePractice, resetDailyProgress } from '@/services/progress';

type LearningState = {
  isLoading: boolean;
  onboardingComplete: boolean;
  profile: LocalProfile | null;
  activeProfile: string;
  streak: number;
  minutesToday: number;
  progress: ProgressState;
  setActiveProfile: (profile: string) => void;
  recordPractice: (routeId: string, score: number) => Promise<void>;
  completeOnboarding: (profile: LocalProfile) => Promise<void>;
};

const PROFILE_STORAGE_KEY = '@hablamejor/profile';
const PROGRESS_STORAGE_KEY = '@hablamejor/progress';
const LearningContext = createContext<LearningState | null>(null);

export function LearningProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressState>(initialProgress);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(PROFILE_STORAGE_KEY), AsyncStorage.getItem(PROGRESS_STORAGE_KEY)])
      .then(([storedProfile, storedProgress]) => {
        if (storedProfile) setProfile(JSON.parse(storedProfile) as LocalProfile);
        if (storedProgress) {
          const savedProgress = JSON.parse(storedProgress) as Partial<ProgressState>;
          const hydratedProgress = { ...initialProgress, ...savedProgress, sessions: savedProgress.sessions ?? [] };
          setProgress(resetDailyProgress(hydratedProgress));
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const completeOnboarding = async (nextProfile: LocalProfile) => {
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
    setProfile(nextProfile);
  };

  const recordPractice = async (routeId: string, score: number) => {
    const nextProgress = savePractice(progress, routeId, score);
    await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(nextProgress));
    setProgress(nextProgress);
  };

  const value = useMemo(() => ({
    isLoading,
    onboardingComplete: profile !== null,
    profile,
    activeProfile: profile?.name ?? '',
    streak: progress.currentStreak,
    minutesToday: progress.minutesToday,
    progress,
    setActiveProfile: (name: string) => setProfile((current) => current ? { ...current, name } : current),
    recordPractice,
    completeOnboarding,
  }), [isLoading, profile, progress]);

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) throw new Error('useLearning debe usarse dentro de LearningProvider');
  return context;
}
