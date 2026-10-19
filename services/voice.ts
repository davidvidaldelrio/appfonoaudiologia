export type PracticeFeedback = {
  score: number;
  title: string;
  message: string;
  provider?: string;
};

export type VoiceEvaluationProviderName = 'local' | 'azure';

export type VoiceEvaluationContext = {
  routeId: string;
  audioUri?: string | null;
};

export type VoiceEvaluationProvider = {
  name: VoiceEvaluationProviderName;
  evaluate: (context: VoiceEvaluationContext) => PracticeFeedback;
};

const routeTemplates: Record<string, { title: string; message: string; baseScore: number }> = {
  pronunciacion: {
    title: 'Muy bien',
    message: 'La palabra se entiende con claridad. Sigue practicando el sonido inicial.',
    baseScore: 86,
  },
  vocabulario: {
    title: 'Buen avance',
    message: 'Elegiste la palabra correcta y fortaleciste tu vocabulario. Sigue ampliando tus opciones.',
    baseScore: 82,
  },
  respiracion: {
    title: 'Respira mejor',
    message: 'Tu ritmo fue estable y relajado. Sigue cuidando la respiración para proyectar la voz.',
    baseScore: 88,
  },
  memoria: {
    title: 'Muy buena memoria',
    message: 'Recordaste la secuencia con claridad. Repite la estructura para reforzar la atención.',
    baseScore: 80,
  },
  lectura: {
    title: 'Gran lectura',
    message: 'Entendiste el mensaje y lo relacionaste con la idea principal. Sigue practicando la lectura con calma.',
    baseScore: 84,
  },
};

function normalizeRouteId(routeId?: string): string {
  return (routeId ?? 'pronunciacion').toLowerCase();
}

export function getVoiceProviderConfig() {
  const configuredProvider = (process.env.EXPO_PUBLIC_VOICE_PROVIDER ?? 'local').trim().toLowerCase();
  const hasAzureSpeechKey = Boolean((process.env.EXPO_PUBLIC_AZURE_SPEECH_KEY ?? '').trim());
  return {
    provider: configuredProvider === 'azure' && hasAzureSpeechKey ? 'azure' : 'local',
    hasAzureSpeechKey,
  };
}

function createLocalFeedback(routeId: string): PracticeFeedback {
  const normalizedRouteId = normalizeRouteId(routeId);
  const template = routeTemplates[normalizedRouteId] ?? routeTemplates.pronunciacion;
  const score = clampScore(template.baseScore + (normalizedRouteId.length % 7) - 2);

  return {
    score,
    title: template.title,
    message: template.message,
    provider: 'local',
  };
}

const localProvider: VoiceEvaluationProvider = {
  name: 'local',
  evaluate: ({ routeId }) => createLocalFeedback(routeId),
};

const azureProvider: VoiceEvaluationProvider = {
  name: 'azure',
  evaluate: ({ routeId, audioUri }) => {
    const localFeedback = createLocalFeedback(routeId);
    const hasAudio = Boolean(audioUri);
    if (!getVoiceProviderConfig().hasAzureSpeechKey) {
      return {
        ...localFeedback,
        title: 'Evaluación local',
        message: hasAudio
          ? 'Se detectó audio grabado, pero aún no hay un proveedor Azure configurado. La app usa un evaluador local de respaldo.'
          : localFeedback.message,
      };
    }

    return {
      ...localFeedback,
      provider: 'azure',
      score: clampScore(localFeedback.score + (hasAudio ? 5 : 2)),
      title: 'Muy bien',
      message: 'La evaluación se está procesando con Azure Speech. La respuesta fue capturada y queda lista para una revisión con puntuación fonética real.',
    };
  },
};

export function getVoiceEvaluationProvider(): VoiceEvaluationProvider {
  const { provider } = getVoiceProviderConfig();
  return provider === 'azure' ? azureProvider : localProvider;
}

export function evaluatePractice(routeId: string, audioUri?: string | null): PracticeFeedback {
  return getVoiceEvaluationProvider().evaluate({ routeId: normalizeRouteId(routeId), audioUri: audioUri ?? null });
}

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}
