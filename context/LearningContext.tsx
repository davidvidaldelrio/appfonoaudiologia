import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

type LearningState = {
  activeProfile: string;
  streak: number;
  minutesToday: number;
  setActiveProfile: (profile: string) => void;
  addPracticeMinutes: (minutes: number) => void;
};

const LearningContext = createContext<LearningState | null>(null);

export function LearningProvider({ children }: PropsWithChildren) {
  const [activeProfile, setActiveProfile] = useState('Sofía');
  const [minutesToday, setMinutesToday] = useState(8);

  const value = useMemo(() => ({
    activeProfile,
    streak: 7,
    minutesToday,
    setActiveProfile,
    addPracticeMinutes: (minutes: number) => setMinutesToday((current) => current + minutes),
  }), [activeProfile, minutesToday]);

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) throw new Error('useLearning debe usarse dentro de LearningProvider');
  return context;
}
