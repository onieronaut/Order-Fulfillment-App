import { ShipmentItem } from '@/components/ShipmentItem';
import { SheetModal } from '@/components/ui/SheetModal';
import { createShipment, getShipments } from '@/db/shipments/database';
import { ShipmentType } from '@/types';
import { Link, useFocusEffect, useGlobalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Button, Text, View, YStack } from 'tamagui';

export default function ShipScreen() {
	const { orderId } = useGlobalSearchParams<{
		orderId: string;
	}>();

	const [shipments, setShipments] = useState<ShipmentType[]>([]);

	async function handleCreateShipment() {
		try {
			await createShipment(parseInt(orderId));
		} catch (err) {
			console.log(err);
		}
	}

	useFocusEffect(
		useCallback(() => {
			if (!orderId) return;

			async function handleGetPackages() {
				try {
					const result = await getShipments(parseInt(orderId));
					setShipments(result);
				} catch (err) {
					console.log(err);
				}
			}
			handleGetPackages();

			return () => {};
		}, [orderId])
	);

	console.log(shipments);

	return (
		<YStack flex={1} padding={10}>
			<Button margin={5} theme='accent' onPress={handleCreateShipment}>
				Create Shipment
			</Button>
			<FlatList
				data={shipments}
				keyExtractor={(item) => item.shipmentId.toString()}
				renderItem={({ item, index }) => (
					<YStack padding={5}>
						<ShipmentItem shipment={item} index={index} />
					</YStack>
				)}
			/>
		</YStack>
	);
}
