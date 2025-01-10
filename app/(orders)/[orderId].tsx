import { LineItem } from '@/components/LineItem';
import { getOrder } from '@/db/orders/database';
import { OrderType } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { YStack } from 'tamagui';

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
		<YStack flex={1} padding={10}>
			<FlatList
				data={order?.items}
				keyExtractor={(item) => `${item.itemId}`}
				renderItem={({ item }) => (
					<YStack padding={5}>
						<LineItem item={item} />
					</YStack>
				)}
			/>
		</YStack>
	);
}
