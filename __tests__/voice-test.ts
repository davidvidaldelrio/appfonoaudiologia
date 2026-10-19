import { evaluatePractice, getVoiceEvaluationProvider, getVoiceProviderConfig } from '@/services/voice';

describe('voice service', () => {
  it('devuelve feedback local para una práctica', () => {
    const feedback = evaluatePractice('pronunciacion');
    expect(feedback.score).toBeGreaterThanOrEqual(0);
    expect(feedback.score).toBeLessThanOrEqual(100);
    expect(feedback.title).toBeTruthy();
    expect(feedback.message.length).toBeGreaterThan(0);
  });

  it('personaliza el feedback según la ruta', () => {
    expect(evaluatePractice('vocabulario').title).toBe('Buen avance');
    expect(evaluatePractice('respiracion').message).toContain('respiración');
    expect(evaluatePractice('lectura').message).toContain('lectura');
  });

  it('usa un proveedor local por defecto cuando no hay configuración de Azure', () => {
    const config = getVoiceProviderConfig();
    const provider = getVoiceEvaluationProvider();
    expect(config.provider).toBe('local');
    expect(provider.name).toBe('local');
  });

  it('permite cambiar a Azure cuando la configuración existe', () => {
    const previousProvider = process.env.EXPO_PUBLIC_VOICE_PROVIDER;
    const previousKey = process.env.EXPO_PUBLIC_AZURE_SPEECH_KEY;
    process.env.EXPO_PUBLIC_VOICE_PROVIDER = 'azure';
    process.env.EXPO_PUBLIC_AZURE_SPEECH_KEY = 'demo-key';

    try {
      const config = getVoiceProviderConfig();
      const provider = getVoiceEvaluationProvider();
      expect(config.provider).toBe('azure');
      expect(provider.name).toBe('azure');
      expect(evaluatePractice('pronunciacion', 'file:///tmp/demo.wav').provider).toBe('azure');
    } finally {
      if (previousProvider === undefined) {
        delete process.env.EXPO_PUBLIC_VOICE_PROVIDER;
      } else {
        process.env.EXPO_PUBLIC_VOICE_PROVIDER = previousProvider;
      }

      if (previousKey === undefined) {
        delete process.env.EXPO_PUBLIC_AZURE_SPEECH_KEY;
      } else {
        process.env.EXPO_PUBLIC_AZURE_SPEECH_KEY = previousKey;
      }
    }
  });
});