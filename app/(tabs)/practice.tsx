import { Redirect } from 'expo-router';
import { useLearning } from '@/context/LearningContext';
import { getRecommendedRoute } from '@/services/practice';

export default function PracticeScreen() {
	const { profile } = useLearning();
	const route = getRecommendedRoute(profile?.goals ?? []);
	return <Redirect href={{ pathname: '/activity/[routeId]', params: { routeId: route.id } }} />;
}
