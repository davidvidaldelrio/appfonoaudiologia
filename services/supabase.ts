import { createClient } from '@supabase/supabase-js';
import { AgeRange, Goal, LocalProfile, UserType } from '@/services/onboarding';

export type DatabaseProfilePayload = {
  id?: string;
  name: string;
  user_type: UserType;
  age_range: AgeRange;
  goals: Goal[];
  created_at?: string;
  updated_at?: string;
};

export function getSupabaseConfig() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

  return {
    url,
    anonKey,
    ready: Boolean(url && anonKey && url.includes('supabase.co')),
  };
}

export const supabase = getSupabaseConfig().ready
  ? createClient(getSupabaseConfig().url, getSupabaseConfig().anonKey)
  : null;

export function normalizeProfileForDatabase(profile: LocalProfile): DatabaseProfilePayload {
  return {
    name: profile.name.trim(),
    user_type: profile.userType,
    age_range: profile.ageRange,
    goals: [...profile.goals],
    updated_at: new Date().toISOString(),
  };
}

export async function syncProfileToSupabase(profile: LocalProfile) {
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
