export type PracticeFeedback = {
  score: number;
  title: string;
  message: string;
};

export function evaluatePractice(routeId: string): PracticeFeedback {
  if (routeId === 'pronunciacion') {
    return { score: 86, title: 'Muy bien', message: 'La palabra se entiende con claridad. Sigue practicando el sonido inicial.' };
  }

  return { score: 82, title: 'Buen trabajo', message: 'Completaste la actividad. Repite una vez más para ganar seguridad.' };
}
