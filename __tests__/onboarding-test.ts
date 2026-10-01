import { canFinishOnboarding, LocalProfile, toggleGoal, upsertProfile } from '@/services/onboarding';

describe('onboarding', () => {
  it('permite seleccionar y quitar objetivos', () => {
    expect(toggleGoal([], 'voice')).toEqual(['voice']);
    expect(toggleGoal(['voice'], 'voice')).toEqual([]);
  });

  it('solo finaliza con perfil completo y al menos un objetivo', () => {
    expect(canFinishOnboarding({ name: 'Ana', userType: 'self', ageRange: '18-59', goals: ['language'] })).toBe(true);
    expect(canFinishOnboarding({ name: 'Ana', userType: 'self', ageRange: '18-59', goals: [] })).toBe(false);
  });

  it('añade perfiles nuevos y actualiza los existentes por nombre', () => {
    const initial: LocalProfile[] = [{ name: 'Ana', userType: 'self', ageRange: '18-59', goals: ['language'] }];
    expect(upsertProfile(initial, { name: 'Luis', userType: 'child', ageRange: '7-12', goals: ['reading'] })).toHaveLength(2);
    expect(upsertProfile(initial, { name: 'Ana', userType: 'self', ageRange: '18-59', goals: ['voice', 'memory'] })).toEqual([
      { name: 'Ana', userType: 'self', ageRange: '18-59', goals: ['voice', 'memory'] },
    ]);
  });
});