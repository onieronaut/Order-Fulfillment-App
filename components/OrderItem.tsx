import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import { Link } from 'expo-router';
import { OrderType } from '@/types';

interface OrderItemPropsType {
	order: OrderType;
}

export const OrderItem = ({ order }: OrderItemPropsType) => {
	return (
		<View style={styles.container}>
			<View style={styles.order}>
				<Text>Order #{order.orderId}</Text>
			</View>
			<View style={styles.items}>
				<Text>Items: {order.items.length}</Text>
			</View>
			<View style={styles.date}>
				<Text>Date: 43</Text>
			</View>
			<Link
				href={{
					pathname: '/(orders)/[orderId]',
					params: { orderId: order.orderId },
				}}
				asChild>
				<Pressable style={styles.button}>
					<Text>View Order</Text>
				</Pressable>
			</Link>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-start',
		padding: 24,
		backgroundColor: '#06313373',
	},
	order: {
		flex: 1,
	},
	items: {
		flex: 1,
	},
	date: {
		flex: 1,
	},
	button: {
		backgroundColor: '#321324',
		padding: 16,
		flex: 1,
	},
});
