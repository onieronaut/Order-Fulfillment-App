import Button from '@/components/Button';
import { Text, View } from '@/components/Themed';
import { createPackage, getBoxes } from '@/db/database';
import { BoxType } from '@/types';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function CreatePackageModal() {
	const [boxes, setBoxes] = useState<BoxType[]>([]);
	const [selectedBox, setSelectedBox] = useState();

	const router = useRouter();

	async function handleCreatePackage() {
		if (!selectedBox) return;

		const box = boxes?.find((x) => x.boxId === parseInt(selectedBox));

		const payload = {
			orderId: 1,
			boxId: box?.boxId,
			name: box?.name,
		};

		try {
			await createPackage(payload as any);
			router.dismiss();
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		async function handleGetBoxes() {
			try {
				const result = await getBoxes();
				setBoxes(result);
			} catch (err) {
				console.log(err);
			}
		}

		handleGetBoxes();
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.boxText}>Box Size</Text>
			<Picker
				selectedValue={selectedBox}
				onValueChange={(itemValue, itemIndex) => setSelectedBox(itemValue)}>
				{boxes?.map((box) => (
					<Picker.Item label={box?.name} value={box?.boxId} />
				))}
			</Picker>
			<Button onPress={handleCreatePackage}>Create Package</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 24,
	},
	boxText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
	},
});
