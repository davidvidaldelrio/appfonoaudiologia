import { calculateLevel } from '@/services/practice';

describe('practice', () => {
  it('calcula el nivel según el puntaje', () => {
    expect(calculateLevel(95)).toBe(3);
    expect(calculateLevel(70)).toBe(2);
    expect(calculateLevel(40)).toBe(1);
  });
});
