import { getSupabaseConfig, normalizeProfileForDatabase } from '@/services/supabase';

describe('supabase readiness', () => {
  const originalUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  afterEach(() => {
    if (originalUrl === undefined) {
      delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    } else {
      process.env.EXPO_PUBLIC_SUPABASE_URL = originalUrl;
    }

    if (originalKey === undefined) {
      delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    } else {
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = originalKey;
    }
  });

  it('normaliza el perfil para la base de datos', () => {
    const result = normalizeProfileForDatabase({
      name: ' Ana ',
      userType: 'self',
      ageRange: '18-59',
      goals: ['reading', 'voice'],
    });

    expect(result.name).toBe('Ana');
    expect(result.user_type).toBe('self');
    expect(result.age_range).toBe('18-59');
    expect(result.goals).toEqual(['reading', 'voice']);
    expect(result.updated_at).toBeTruthy();
  });

  it('detecta si la configuración de Supabase está lista para usarse', () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    expect(getSupabaseConfig().ready).toBe(false);

    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://demo.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'demo-key';
    expect(getSupabaseConfig().ready).toBe(true);
  });
});
