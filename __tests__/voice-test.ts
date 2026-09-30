import { evaluatePractice } from '@/services/voice';

describe('voice service', () => {
  it('devuelve feedback local para una práctica', () => {
    const feedback = evaluatePractice('pronunciacion');
    expect(feedback.score).toBeGreaterThanOrEqual(0);
    expect(feedback.score).toBeLessThanOrEqual(100);
    expect(feedback.title).toBeTruthy();
  });
});