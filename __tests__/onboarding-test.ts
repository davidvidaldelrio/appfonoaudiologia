import { canFinishOnboarding, toggleGoal } from '@/services/onboarding';

describe('onboarding', () => {
  it('permite seleccionar y quitar objetivos', () => {
    expect(toggleGoal([], 'voice')).toEqual(['voice']);
    expect(toggleGoal(['voice'], 'voice')).toEqual([]);
  });

  it('solo finaliza con perfil completo y al menos un objetivo', () => {
    expect(canFinishOnboarding({ name: 'Ana', userType: 'self', ageRange: '18-59', goals: ['language'] })).toBe(true);
    expect(canFinishOnboarding({ name: 'Ana', userType: 'self', ageRange: '18-59', goals: [] })).toBe(false);
  });
});