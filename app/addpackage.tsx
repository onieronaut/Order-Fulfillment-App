import { Text, View } from '@/components/Themed';
import { useLocalSearchParams } from 'expo-router';

export default function AddPackageModal() {
	const { orderId, shipmentId } = useLocalSearchParams<{
		orderId: string;
		shipmentId: string;
	}>();

	return (
		<View>
			<Text>hi</Text>
		</View>
	);
}
