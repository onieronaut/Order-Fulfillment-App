import { LineItem } from '@/components/LineItem';
import { Text, View } from '@/components/Themed';
import { getOrder } from '@/db/database';
import { OrderType } from '@/types/order';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

export default function DetailsScreen() {
	const [order, setOrder] = useState<OrderType>();

	useEffect(() => {
		async function fetchOrder() {
			try {
				const result = await getOrder(1);
				setOrder(result);
				console.log('order', result);
			} catch (err) {
				console.log(err);
			}
		}

		fetchOrder();
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Text style={styles.header}>Line Items</Text>
			</View>
			<FlatList
				data={order?.items}
				keyExtractor={(item) => item.itemId}
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
