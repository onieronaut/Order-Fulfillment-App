import { Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { OrderType, ShipmentType } from '@/types';
import { Text, View } from 'tamagui';

interface OrderItemPropsType {
	shipment: ShipmentType;
}

export const ShipmentItem = ({ shipment }: OrderItemPropsType) => {
	return (
		<View style={styles.container}>
			<View style={styles.order}>
				<Text>Shipment #{shipment.shipmentId}</Text>
			</View>
			<View style={styles.items}>
				<Text>Packages: {shipment?.packages?.length}</Text>
			</View>
			<View style={styles.date}>
				<Text>Status: {shipment.status}</Text>
			</View>
			<Link
				href={{
					pathname: '/addpackage',
					params: {
						orderId: shipment.orderId,
						shipmentId: shipment.shipmentId,
					},
				}}
				asChild>
				<Pressable style={styles.buttonContainer}>
					<Text>Add Item</Text>
				</Pressable>
			</Link>
			{/* <Link
                href={{
                    pathname: '/(orders)/[orderId]',
                    params: { orderId: order.orderId },
                }}
                asChild>
                <Pressable style={styles.button}>
                    <Text>View Order</Text>
                </Pressable>
            </Link> */}
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
	buttonContainer: {
		flex: 1,
		height: '100%',
		width: '100%',
		backgroundColor: '#EC3F9E',
	},
});
