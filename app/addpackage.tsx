import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'tamagui';

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
