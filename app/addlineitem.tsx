import Button from '@/components/Button';
import { Text, View } from '@/components/Themed';
import { addLineItemToPackage, getOrder } from '@/db/database';
import { OrderType } from '@/types';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

export default function AddLineItemModal() {
	const [order, setOrder] = useState<OrderType>();
	const [selectedItem, setSelectedItem] = useState();
	const [number, onChangeNumber] = useState('');

	async function handleAddLineItemToPackage() {
		if (!selectedItem) return;

		const item = order?.items.find(
			(item) => item.itemId === parseInt(selectedItem)
		);

		const payload = {
			orderId: 1,
			packageId: 1,
			itemId: item?.itemId,
			name: item?.name,
			quantity: number,
		};
		console.log(payload);

		try {
			const res = await addLineItemToPackage(payload as any);
			console.log(res);
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		async function handleGetOrder() {
			try {
				const result = await getOrder(1);
				setOrder(result as any);
			} catch (err) {
				console.log(err);
			}
		}

		handleGetOrder();
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.lineItem}>Line Item</Text>
			<Picker
				selectedValue={selectedItem}
				onValueChange={(itemValue, itemIndex) => setSelectedItem(itemValue)}>
				{order?.items?.map((item) => (
					<Picker.Item
						label={item?.name}
						value={item?.itemId}
						key={item?.itemId}
					/>
				))}
			</Picker>
			<Text style={styles.lineItem}>Quantity</Text>
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					keyboardType='number-pad'
					onChangeText={onChangeNumber}
					value={number}
					returnKeyType='done'
				/>
			</View>
			<Button onPress={handleAddLineItemToPackage}>Add to Package</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 24,
	},
	lineItem: {
		fontSize: 24,
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
		marginVertical: 12,
	},
	inputContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	input: {
		borderWidth: 2,
		fontSize: 36,
		borderColor: 'gray',
		padding: 20,
		width: 100,
		borderRadius: 4,
		color: 'white', // Ensure text color is visible
	},
});
