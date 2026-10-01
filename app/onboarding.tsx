import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useLearning } from '@/context/LearningContext';
import { AgeRange, canFinishOnboarding, Goal, LocalProfile, toggleGoal, UserType } from '@/services/onboarding';
import { t } from '@/services/i18n';
import { getRecommendedRoute } from '@/services/practice';

const ageRanges: AgeRange[] = ['0-6', '7-12', '13-17', '18-59', '60+'];
const ageLabels: Record<AgeRange, Parameters<typeof t>[0]> = { '0-6': 'age0to6', '7-12': 'age7to12', '13-17': 'age13to17', '18-59': 'age18to59', '60+': 'age60plus' };
const goals: { key: Goal; label: Parameters<typeof t>[0] }[] = [
  { key: 'pronunciation', label: 'goalPronunciation' },
  { key: 'language', label: 'goalLanguage' },
  { key: 'voice', label: 'goalVoice' },
  { key: 'memory', label: 'goalMemory' },
  { key: 'reading', label: 'goalReading' },
];
const routeNameKeys: Record<string, Parameters<typeof t>[0]> = { pronunciacion: 'recommendedRouteName', vocabulario: 'vocabularyRouteName', respiracion: 'voiceRouteName', memoria: 'memoryRouteName', lectura: 'readingRouteName' };

export default function OnboardingScreen() {
  const { completeOnboarding } = useLearning();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<LocalProfile>>({ name: '', goals: [] });
  const [error, setError] = useState('');

  const update = (changes: Partial<LocalProfile>) => { setProfile((current) => ({ ...current, ...changes })); setError(''); };
  const next = () => {
    if (step === 1 && !profile.userType) return setError(t('requiredUserType'));
    if (step === 2 && !profile.name?.trim()) return setError(t('requiredName'));
    if (step === 2 && !profile.ageRange) return setError(t('requiredAge'));
    if (step === 3 && !profile.goals?.length) return setError(t('requiredGoal'));
    setStep((current) => current + 1);
  };
  const finish = async () => {
    if (!canFinishOnboarding(profile)) return;
    await completeOnboarding(profile);
    router.replace('/(tabs)');
  };

  if (step === 0) return <View style={styles.welcome}><Text style={styles.brand}>{t('appName')}</Text><Text style={styles.welcomeTitle}>{t('onboardingWelcomeTitle')}</Text><Text style={styles.welcomeDescription}>{t('onboardingWelcomeDescription')}</Text><Pressable style={styles.primaryButton} onPress={next}><Text style={styles.primaryButtonText}>{t('onboardingStart')}</Text></Pressable></View>;

  return <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
    <Text style={styles.progress}>{t('onboardingStep')} {step} {t('onboardingOf')} 4</Text>
    {step === 1 && <SelectionStep title={t('onboardingWhoTitle')} options={[['self', t('forMe')], ['child', t('forChild')], ['olderAdult', t('forOlderAdult')]]} selected={profile.userType} onSelect={(value) => update({ userType: value as UserType })} />}
    {step === 2 && <View><Text style={styles.title}>{t('onboardingProfileTitle')}</Text><Text style={styles.label}>{t('nameLabel')}</Text><TextInput style={styles.input} value={profile.name ?? ''} onChangeText={(name) => update({ name })} placeholder={t('namePlaceholder')} placeholderTextColor={Colors.muted} /><Text style={styles.label}>{t('ageLabel')}</Text><View style={styles.options}>{ageRanges.map((range) => <Option key={range} label={t(ageLabels[range])} selected={profile.ageRange === range} onPress={() => update({ ageRange: range })} />)}</View></View>}
    {step === 3 && <View><Text style={styles.title}>{t('onboardingGoalsTitle')}</Text><Text style={styles.description}>{t('goalsDescription')}</Text><View style={styles.options}>{goals.map((goal) => <Option key={goal.key} label={t(goal.label)} selected={profile.goals?.includes(goal.key) ?? false} onPress={() => update({ goals: toggleGoal(profile.goals ?? [], goal.key) })} />)}</View></View>}
    {step === 4 && <View><Text style={styles.title}>{t('onboardingSummaryTitle')}</Text><Text style={styles.description}>{t('onboardingSummaryDescription')}</Text><View style={styles.summary}><Text style={styles.summaryLabel}>{t('nameLabel')}</Text><Text style={styles.summaryValue}>{profile.name}</Text><Text style={styles.summaryLabel}>{t('recommendedRoute')}</Text><Text style={styles.summaryValue}>{t(routeNameKeys[getRecommendedRoute(profile.goals ?? []).id])}</Text></View></View>}
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <View style={styles.actions}>{step > 1 && <Pressable onPress={() => { setError(''); setStep((current) => current - 1); }}><Text style={styles.back}>{t('back')}</Text></Pressable>}<Pressable style={styles.primaryButton} onPress={step === 4 ? finish : next}><Text style={styles.primaryButtonText}>{step === 4 ? t('finishOnboarding') : t('next')}</Text></Pressable></View>
  </ScrollView>;
}

function SelectionStep({ title, options, selected, onSelect }: { title: string; options: [string, string][]; selected?: string; onSelect: (value: string) => void }) {
  return <View><Text style={styles.title}>{title}</Text><View style={styles.options}>{options.map(([value, label]) => <Option key={value} label={label} selected={selected === value} onPress={() => onSelect(value)} />)}</View></View>;
}

function Option({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable style={[styles.option, selected && styles.optionSelected]} onPress={onPress}><Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text><Text style={styles.check}>{selected ? '✓' : ''}</Text></Pressable>;
}

const styles = StyleSheet.create({
  welcome: { flex: 1, backgroundColor: Colors.primary, padding: 28, justifyContent: 'center' },
  brand: { color: '#D8D1FF', fontSize: 13, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' },
  welcomeTitle: { color: '#FFF', fontSize: 38, lineHeight: 45, fontWeight: '800', marginTop: 18 },
  welcomeDescription: { color: '#E5E0FF', fontSize: 17, lineHeight: 25, marginTop: 16, marginBottom: 34 },
  container: { flexGrow: 1, backgroundColor: Colors.background, padding: 24, justifyContent: 'center' },
  progress: { color: Colors.primary, fontSize: 12, fontWeight: '800', marginBottom: 24 },
  title: { color: Colors.ink, fontSize: 29, lineHeight: 36, fontWeight: '800', marginBottom: 24 },
  description: { color: Colors.muted, fontSize: 15, lineHeight: 22, marginTop: -12, marginBottom: 24 },
  label: { color: Colors.ink, fontSize: 14, fontWeight: '700', marginBottom: 8 },
  input: { backgroundColor: Colors.card, borderColor: Colors.border, borderWidth: 1, borderRadius: 14, padding: 15, fontSize: 16, color: Colors.ink, marginBottom: 24 },
  options: { gap: 12 },
  option: { backgroundColor: Colors.card, borderColor: Colors.border, borderWidth: 1, borderRadius: 16, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optionSelected: { borderColor: Colors.primary, backgroundColor: '#F0EEFF' },
  optionText: { color: Colors.ink, fontSize: 16, fontWeight: '600' },
  optionTextSelected: { color: Colors.primary },
  check: { color: Colors.primary, fontSize: 20, fontWeight: '800', width: 20, textAlign: 'center' },
  summary: { backgroundColor: Colors.card, borderRadius: 18, padding: 20, gap: 8 },
  summaryLabel: { color: Colors.muted, fontSize: 12, marginTop: 4 },
  summaryValue: { color: Colors.ink, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  error: { color: '#C53B55', fontSize: 13, marginTop: 18 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 24, marginTop: 32 },
  back: { color: Colors.primary, fontWeight: '700' },
  primaryButton: { backgroundColor: '#FFF', borderRadius: 14, paddingVertical: 15, paddingHorizontal: 20, alignSelf: 'flex-start' },
  primaryButtonText: { color: Colors.primary, fontWeight: '800', fontSize: 15 },
});