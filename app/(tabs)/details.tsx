import { LineItem } from '@/components/LineItem';
import { Text, View } from '@/components/Themed';
import { getOrder } from '@/db/database';
import { OrderType } from '@/types';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

export default function DetailsScreen() {
	const [order, setOrder] = useState<OrderType>();

	useEffect(() => {
		async function handleGetOrder() {
			try {
				const result = await getOrder(1);
				setOrder(result);
				console.log('order', result);
			} catch (err) {
				console.log(err);
			}
		}

		handleGetOrder();
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>
				<Text style={styles.header}>Line Items</Text>
			</View>
			<FlatList
				data={order?.items}
				// keyExtractor={(item) => item.}
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
