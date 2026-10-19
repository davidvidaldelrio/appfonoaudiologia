import { createClient } from '@supabase/supabase-js';
import { AgeRange, Goal, LocalProfile, UserType } from '@/services/onboarding';
import { ProgressState } from '@/services/progress';

export type DatabaseProfilePayload = {
  id?: string;
  name: string;
  user_type: UserType;
  age_range: AgeRange;
  goals: Goal[];
  created_at?: string;
  updated_at?: string;
};

export type DatabaseProgressPayload = {
  profile_name: string;
  minutes_today: number;
  xp: number;
  current_streak: number;
  longest_streak: number;
  last_practice_date: string | null;
  route_scores: Record<string, number>;
  sessions: Array<{ routeId: string; score: number; xp: number; date: string }>;
  updated_at: string;
};

function normalizeEnvValue(value?: string): string {
  return (value ?? '').trim();
}

export function getSupabaseConfig() {
  const url = normalizeEnvValue(process.env.EXPO_PUBLIC_SUPABASE_URL);
  const anonKey = normalizeEnvValue(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
  const hasValidUrl = (() => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  })();

  return {
    url,
    anonKey,
    ready: Boolean(hasValidUrl && anonKey),
  };
}

export function getSupabaseClient() {
  const { url, anonKey, ready } = getSupabaseConfig();
  if (!ready) {
    return null;
  }

  return createClient(url, anonKey);
}

export function normalizeProfileForDatabase(profile: LocalProfile): DatabaseProfilePayload {
  return {
    name: profile.name.trim(),
    user_type: profile.userType,
    age_range: profile.ageRange,
    goals: [...profile.goals],
    updated_at: new Date().toISOString(),
  };
}

export function normalizeProgressForDatabase(progress: ProgressState, profileName: string): DatabaseProgressPayload {
  return {
    profile_name: profileName.trim(),
    minutes_today: progress.minutesToday,
    xp: progress.xp,
    current_streak: progress.currentStreak,
    longest_streak: progress.longestStreak,
    last_practice_date: progress.lastPracticeDate,
    route_scores: { ...progress.routeScores },
    sessions: progress.sessions.map((session) => ({ ...session })),
    updated_at: new Date().toISOString(),
  };
}

export async function syncProfileToSupabase(profile: LocalProfile) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  const payload = normalizeProfileForDatabase(profile);
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ ...payload, name: payload.name }, { onConflict: 'name' })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function syncProgressToSupabase(progress: ProgressState, profileName: string) {
  const supabase = getSupabaseClient();
  const nextName = profileName.trim();
  if (!supabase || !nextName) {
    return null;
  }

  const payload = normalizeProgressForDatabase(progress, nextName);
  const { data, error } = await supabase
    .from('progress')
    .upsert({ ...payload, profile_name: nextName }, { onConflict: 'profile_name' })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
