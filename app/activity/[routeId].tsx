import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Colors } from '@/constants/Colors';
import { useLearning } from '@/context/LearningContext';
import { evaluatePractice, PracticeFeedback } from '@/services/voice';
import { useAudioRecorderService } from '@/services/audioRecorder';
import { t } from '@/services/i18n';

export default function ActivityScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const { recordPractice } = useLearning();
  const recorder = useAudioRecorderService();
  const [feedback, setFeedback] = useState<PracticeFeedback | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [recordingError, setRecordingError] = useState(false);
  const isPronunciation = routeId === 'pronunciacion';
  const title = isPronunciation ? t('recommendedRouteName') : routeId === 'vocabulario' ? t('vocabularyRouteName') : routeId === 'respiracion' ? t('voiceRouteName') : routeId === 'memoria' ? t('memoryRouteName') : t('readingRouteName');
  const prompt = isPronunciation ? t('listenAndRepeat') : routeId === 'vocabulario' ? t('vocabularyPrompt') : routeId === 'respiracion' ? t('voicePrompt') : routeId === 'memoria' ? t('memoryPrompt') : t('readingPrompt');
  const word = isPronunciation ? t('targetWord') : routeId === 'vocabulario' ? t('vocabularyWord') : routeId === 'respiracion' ? t('voiceWord') : routeId === 'memoria' ? t('memoryWord') : t('readingWord');
  const hint = isPronunciation ? t('activityHint') : routeId === 'vocabulario' ? t('vocabularyHint') : routeId === 'respiracion' ? t('voiceHint') : routeId === 'memoria' ? t('memoryHint') : t('readingHint');

  const recordAnswer = async () => {
    if (!isPronunciation) {
      setIsEvaluating(true);
      const nextFeedback = evaluatePractice(routeId ?? 'vocabulario');
      setFeedback(nextFeedback);
      await recordPractice(routeId ?? 'vocabulario', nextFeedback.score);
      setIsEvaluating(false);
      return;
    }

    if (!recorder.isRecording) {
      const started = await recorder.start();
      setRecordingError(!started);
      return;
    }

    setRecordingError(false);
    setIsEvaluating(true);
    await recorder.stop();
    setTimeout(() => {
      const nextFeedback = evaluatePractice(routeId ?? 'pronunciacion');
      setFeedback(nextFeedback);
      void recordPractice(routeId ?? 'pronunciacion', nextFeedback.score);
      setIsEvaluating(false);
    }, 400);
  };

  return <Screen><View style={styles.content}><Text style={styles.eyebrow}>{t('activityEyebrow')}</Text><Text style={styles.title}>{title}</Text><Text style={styles.subtitle}>{prompt}</Text><View style={styles.activity}><Text style={styles.mouth}>{isPronunciation ? '◉' : routeId === 'vocabulario' ? '✦' : routeId === 'respiracion' ? '≈' : routeId === 'memoria' ? '✧' : '▤'}</Text><Text style={styles.prompt}>{prompt}</Text><Text style={styles.word}>{word}</Text><Text style={styles.hint}>{hint}</Text>{recordingError && <Text style={styles.error}>{t('microphonePermissionDenied')}</Text>}{feedback ? <Feedback feedback={feedback} /> : <Pressable style={styles.record} onPress={recordAnswer} disabled={isEvaluating}><Text style={styles.recordText}>{isEvaluating ? t('evaluating') : isPronunciation ? recorder.isRecording ? `■  ${t('stopRecording')}` : `●  ${t('recordAnswer')}` : t('completeActivity')}</Text></Pressable>}{recorder.isRecording && <Text style={styles.timer}>{t('recordingSeconds').replace('{seconds}', String(Math.round(recorder.durationMillis / 1000)))}</Text>}</View>{feedback && <View style={styles.actions}><Pressable onPress={() => setFeedback(null)}><Text style={styles.secondary}>{t('practiceAgain')}</Text></Pressable><Pressable style={styles.primary} onPress={() => router.replace('/(tabs)/routes')}><Text style={styles.primaryText}>{t('backToRoutes')}</Text></Pressable></View>}</View></Screen>;
}

function Feedback({ feedback }: { feedback: PracticeFeedback }) {
  return <View style={styles.feedback}><Text style={styles.feedbackTitle}>{feedback.title}</Text><Text style={styles.score}>{feedback.score}</Text><Text style={styles.scoreLabel}>{t('feedbackScore')}</Text><Text style={styles.feedbackMessage}>{feedback.message}</Text><Text style={styles.minutes}>{t('minutesAdded')}</Text></View>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 28 },
  eyebrow: { color: Colors.primary, fontWeight: '800', letterSpacing: 1.4, fontSize: 11 },
  title: { color: Colors.ink, fontSize: 28, fontWeight: '800', marginTop: 8 },
  subtitle: { color: Colors.muted, marginTop: 4 },
  activity: { backgroundColor: Colors.card, borderRadius: 24, alignItems: 'center', padding: 28, marginTop: 28 },
  mouth: { backgroundColor: '#EAF5FF', color: Colors.primary, fontSize: 42, padding: 18, borderRadius: 24 },
  prompt: { color: Colors.muted, marginTop: 24 },
  word: { color: Colors.ink, fontSize: 42, fontWeight: '800', marginTop: 8 },
  hint: { color: Colors.muted, textAlign: 'center', lineHeight: 20, marginTop: 12 },
  record: { backgroundColor: Colors.primary, borderRadius: 14, padding: 16, width: '100%', alignItems: 'center', marginTop: 26 },
  recordText: { color: '#FFF', fontWeight: '700' },
  error: { color: '#C53B55', fontSize: 13, textAlign: 'center', marginTop: 16 },
  timer: { color: Colors.primary, fontSize: 12, fontWeight: '700', marginTop: 12 },
  feedback: { alignItems: 'center', marginTop: 24, width: '100%' },
  feedbackTitle: { color: Colors.success, fontSize: 18, fontWeight: '800' },
  score: { color: Colors.ink, fontSize: 52, fontWeight: '800', marginTop: 8 },
  scoreLabel: { color: Colors.muted, fontSize: 12 },
  feedbackMessage: { color: Colors.muted, lineHeight: 20, textAlign: 'center', marginTop: 14 },
  minutes: { color: Colors.success, fontSize: 12, fontWeight: '700', textAlign: 'center', marginTop: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
  secondary: { color: Colors.primary, fontWeight: '700' },
  primary: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 16 },
  primaryText: { color: '#FFF', fontWeight: '700' },
});