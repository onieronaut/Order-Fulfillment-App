import { LineItem } from '@/components/LineItem';
import { Text, View } from '@/components/Themed';
import { getOrder } from '@/db/orders/database';
import { OrderType } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

export default function OrderScreen() {
	const { orderId } = useLocalSearchParams<{ orderId: string }>();

	const [order, setOrder] = useState<OrderType>();

	useEffect(() => {
		if (!orderId) return;

		async function handleGetOrder() {
			try {
				const result = await getOrder(parseInt(orderId));
				setOrder(result);
			} catch (err) {
				console.log(err);
			}
		}

		handleGetOrder();
	}, [orderId]);

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Text style={styles.header}>Line Items</Text>
			</View>
			<FlatList
				data={order?.items}
				keyExtractor={(item) => `${item.itemId}`}
				renderItem={({ item }) => <LineItem item={item} />}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginVertical: 8,
	},
	headerContainer: {
		marginVertical: 8,
	},
	header: {
		textAlign: 'center',
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white',
	},
});
