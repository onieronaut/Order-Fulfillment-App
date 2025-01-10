import { FlatList } from 'react-native';

import { OrderItem } from '@/components/OrderItem';
import { getOrders } from '@/db/orders/database';
import { OrderType } from '@/types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { YStack } from 'tamagui';

export default function OrdersScreen() {
	const [orders, setOrders] = useState<OrderType[]>([]);

	useFocusEffect(
		useCallback(() => {
			async function fetchOrders() {
				try {
					const result = await getOrders();
					setOrders(result);
				} catch (err) {
					console.log(err);
				}
			}

			fetchOrders();

			return () => {};
		}, [])
	);

	return (
		<YStack flex={1} padding={10}>
			<FlatList
				data={orders}
				keyExtractor={(item) => item.orderId.toString()}
				renderItem={({ item }) => (
					<YStack padding={5}>
						<OrderItem order={item} />
					</YStack>
				)}
			/>
		</YStack>
	);
}
