import Button from '@/components/Button';
import { ShipmentItem } from '@/components/ShipmentItem';
import { createShipment, getShipments } from '@/db/shipments/database';
import { ShipmentType } from '@/types';
import { Link, useFocusEffect, useGlobalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Text, View } from 'tamagui';

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
		<View style={styles.container}>
			<Text style={styles.header}>Shipments</Text>
			{/* <Link href={{ pathname: '/createshipment' }} asChild> */}
			<Button onPress={handleCreateShipment}>Create Shipment</Button>
			{/* </Link> */}
			<FlatList
				data={shipments}
				keyExtractor={(item) => item.shipmentId.toString()}
				renderItem={({ item }) => <ShipmentItem shipment={item} />}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		textAlign: 'center',
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white',
	},
});
