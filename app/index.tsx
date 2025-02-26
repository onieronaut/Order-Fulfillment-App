import { FlatList } from 'react-native';

import { OrderItem } from '@/components/OrderItem';
import { createOrder, getOrders } from '@/db/orders/database';
import { OrderType } from '@/types';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Button, YStack } from 'tamagui';
import { Entypo } from '@expo/vector-icons';
import { createBox, getBoxes } from '@/db/boxes/database';

export default function OrdersScreen() {
	const [orders, setOrders] = useState<OrderType[]>([]);

	async function handleGetOrders() {
		try {
			const result = await getOrders();
			setOrders(result);
		} catch (err) {
			console.log(err);
		}
	}

	useFocusEffect(
		useCallback(() => {
			handleGetOrders();

			return () => {};
		}, [])
	);

	async function handleCreateOrder() {
		try {
			await createOrder();
			await handleGetOrders();
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<YStack flex={1} padding={10}>
			<FlatList
				data={orders}
				keyExtractor={(item) => item.orderId.toString()}
				renderItem={({ item, index }) => (
					<YStack padding={5}>
						<OrderItem order={item} index={index} />
					</YStack>
				)}
			/>
			<YStack height={'10%'} justifyContent='center'>
				<Button
					theme='accent'
					icon={<Entypo name='circle-with-plus' size={16} color='white' />}
					onPress={handleCreateOrder}>
					Generate New Order
				</Button>
			</YStack>
		</YStack>
	);
}
