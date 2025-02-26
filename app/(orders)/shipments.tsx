import { AddPackagesToShipment } from '@/components/AddPackagesToShipment';
import { ShipmentItem } from '@/components/ShipmentItem';
import { createShipment, getShipments } from '@/db/shipments/database';
import { ShipmentType } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useGlobalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { Button, H3, YStack } from 'tamagui';

export default function ShipScreen() {
	const { orderId } = useGlobalSearchParams<{
		orderId: string;
	}>();

	const [shipments, setShipments] = useState<ShipmentType[]>([]);

	async function handleCreateShipment() {
		try {
			await createShipment(orderId);
			await handleGetShipments();
		} catch (err) {
			console.log(err);
		}
	}

	async function handleGetShipments() {
		try {
			const result = await getShipments(orderId);
			console.log(result);

			setShipments(result);
		} catch (err) {
			console.log(err);
		}
	}

	useFocusEffect(
		useCallback(() => {
			if (!orderId) return;

			handleGetShipments();

			return () => {};
		}, [orderId])
	);

	return (
		<YStack flex={1} padding={10}>
			{shipments.length === 0 && <H3 textAlign='center'>No Shipments Exist</H3>}
			<FlatList
				data={shipments}
				keyExtractor={(item) => item.shipmentId.toString()}
				renderItem={({ item, index }) => (
					<YStack padding={5}>
						<ShipmentItem
							shipment={item}
							index={index}
							handleGetShipments={handleGetShipments}
						/>
					</YStack>
				)}
			/>
			<YStack height={'10%'} justifyContent='center'>
				<Button
					theme='accent'
					onPress={handleCreateShipment}
					icon={
						<MaterialIcons name='local-shipping' size={18} color={'white'} />
					}>
					Create Shipment
				</Button>
			</YStack>
		</YStack>
	);
}
