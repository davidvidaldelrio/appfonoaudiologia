import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LocalProfile, upsertProfile } from '@/services/onboarding';
import { syncProfileToSupabase, getSupabaseConfig } from '@/services/supabase';
import { initialProgress, ProgressState, recordPractice as savePractice, resetDailyProgress } from '@/services/progress';

type LearningState = {
  isLoading: boolean;
  onboardingComplete: boolean;
  profile: LocalProfile | null;
  profiles: LocalProfile[];
  activeProfile: string;
  streak: number;
  minutesToday: number;
  progress: ProgressState;
  setActiveProfile: (profile: string) => void;
  recordPractice: (routeId: string, score: number) => Promise<void>;
  completeOnboarding: (profile: LocalProfile) => Promise<void>;
};

const PROFILE_STORAGE_KEY = '@hablamejor/profile';
const PROFILES_STORAGE_KEY = '@hablamejor/profiles';
const ACTIVE_PROFILE_STORAGE_KEY = '@hablamejor/activeProfile';
const PROGRESS_STORAGE_KEY = '@hablamejor/progress';
const LearningContext = createContext<LearningState | null>(null);

export function LearningProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [profiles, setProfiles] = useState<LocalProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressState>(initialProgress);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(PROFILES_STORAGE_KEY),
      AsyncStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY),
      AsyncStorage.getItem(PROFILE_STORAGE_KEY),
      AsyncStorage.getItem(PROGRESS_STORAGE_KEY),
    ])
      .then(([storedProfiles, storedActiveProfile, legacyProfile, storedProgress]) => {
        const parsedProfiles = storedProfiles ? JSON.parse(storedProfiles) as LocalProfile[] : [];
        const fallbackProfile = legacyProfile ? JSON.parse(legacyProfile) as LocalProfile : null;
        const nextProfiles = parsedProfiles.length ? parsedProfiles : fallbackProfile ? [fallbackProfile] : [];
        setProfiles(nextProfiles);

        const activeProfileName = storedActiveProfile ?? nextProfiles[0]?.name ?? fallbackProfile?.name ?? null;
        const selectedProfile = nextProfiles.find((candidate) => candidate.name === activeProfileName) ?? nextProfiles[0] ?? fallbackProfile ?? null;
        if (selectedProfile) setProfile(selectedProfile);

        if (storedProgress) {
          const savedProgress = JSON.parse(storedProgress) as Partial<ProgressState>;
          const hydratedProgress = { ...initialProgress, ...savedProgress, sessions: savedProgress.sessions ?? [] };
          setProgress(resetDailyProgress(hydratedProgress));
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const completeOnboarding = async (nextProfile: LocalProfile) => {
    const nextProfiles = upsertProfile(profiles, nextProfile);
    await AsyncStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(nextProfiles));
    await AsyncStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, nextProfile.name);
    if (getSupabaseConfig().ready) {
      await syncProfileToSupabase(nextProfile);
    }
    setProfiles(nextProfiles);
    setProfile(nextProfile);
  };

  const recordPractice = async (routeId: string, score: number) => {
    const nextProgress = savePractice(progress, routeId, score);
    await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(nextProgress));
    setProgress(nextProgress);
  };

  const setActiveProfile = (name: string) => {
    const nextProfile = profiles.find((candidate) => candidate.name === name) ?? null;
    if (!nextProfile) return;
    setProfile(nextProfile);
    AsyncStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, name).catch(() => undefined);
  };

  const value = useMemo(() => ({
    isLoading,
    onboardingComplete: profile !== null || profiles.length > 0,
    profile,
    profiles,
    activeProfile: profile?.name ?? profiles[0]?.name ?? '',
    streak: progress.currentStreak,
    minutesToday: progress.minutesToday,
    progress,
    setActiveProfile,
    recordPractice,
    completeOnboarding,
  }), [isLoading, profile, profiles, progress]);

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) throw new Error('useLearning debe usarse dentro de LearningProvider');
  return context;
}
