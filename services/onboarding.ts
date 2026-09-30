export type UserType = 'self' | 'child' | 'olderAdult';
export type AgeRange = '0-6' | '7-12' | '13-17' | '18-59' | '60+';
export type Goal = 'pronunciation' | 'language' | 'voice' | 'memory' | 'reading';

export type LocalProfile = {
  name: string;
  userType: UserType;
  ageRange: AgeRange;
  goals: Goal[];
};

export function toggleGoal(goals: Goal[], goal: Goal): Goal[] {
  return goals.includes(goal) ? goals.filter((item) => item !== goal) : [...goals, goal];
}

export function canFinishOnboarding(profile: Partial<LocalProfile>): profile is LocalProfile {
  return Boolean(profile.name?.trim() && profile.userType && profile.ageRange && profile.goals?.length);
}