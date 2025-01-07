import { FlatList, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { getOrders } from '@/db/database';
import { OrderItem } from '@/components/OrderItem';

export default function TabOneScreen() {
	const [orders, setOrders] = useState<any>([]);

	useEffect(() => {
		async function fetchOrders() {
			try {
				const result = await getOrders();
				setOrders(result);
				console.log('orders', result);
			} catch (err) {
				console.log(err);
			}
		}

		fetchOrders();
	}, []);

	return (
		<View style={styles.container}>
			<FlatList
				data={orders}
				keyExtractor={(item) => item.orderId}
				renderItem={({ item }) => <OrderItem />}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 8,
	},
});
