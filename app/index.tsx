import { Redirect } from 'expo-router';
import { useLearning } from '@/context/LearningContext';

export default function Index() {
	const { isLoading, onboardingComplete } = useLearning();
	if (isLoading) return null;
	return <Redirect href={onboardingComplete ? '/(tabs)' : '/onboarding'} />;
}
