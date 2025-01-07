import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ItemType } from '@/types/order';

interface LineItemPropsType {
	item: ItemType;
}

export const LineItem = ({ item }: LineItemPropsType) => {
	return (
		<View style={styles.container}>
			<View style={styles.nameContainer}>
				<Text style={styles.name}>{item.name}</Text>
			</View>
			<View style={styles.quantityContainer}>
				<Text style={styles.quantity}>Quantity: {item.quantity}</Text>
			</View>
			<Pressable style={styles.buttonContainer}>
				<Text>Pack</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-start',
		padding: 24,
		backgroundColor: '#0B787E73',
	},
	name: {
		fontSize: 16,
		fontWeight: 'bold',
		color: 'white',
	},
	quantity: {
		fontSize: 12,
		fontWeight: 'bold',
		color: 'white',
	},
	quantityContainer: {
		flex: 1,
	},
	nameContainer: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		height: '100%',
		width: '100%',
		backgroundColor: '#EC3F9E',
	},
});
