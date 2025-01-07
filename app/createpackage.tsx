import Button from '@/components/Button';
import { Text, View } from '@/components/Themed';
import { getBoxes } from '@/db/database';
import { BoxType } from '@/types';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function CreatePackageModal() {
	const [boxes, setBoxes] = useState<BoxType[]>();
	const [selectedLanguage, setSelectedLanguage] = useState();

	async function handleCreatePackage() {
		console.log(selectedLanguage);
	}

	useEffect(() => {
		async function handleGetBoxes() {
			try {
				const result = await getBoxes();
				setBoxes(result as any);
			} catch (err) {
				console.log(err);
			}
		}

		handleGetBoxes();
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.boxContainer}>
				<Text style={styles.boxText}>Box Size</Text>
				<Picker
					selectedValue={selectedLanguage}
					onValueChange={(itemValue, itemIndex) =>
						setSelectedLanguage(itemValue)
					}>
					{boxes?.map((box) => (
						<Picker.Item label={box?.name} value={box?.name} />
					))}
				</Picker>
			</View>
			<Button onPress={handleCreatePackage}>Create Package</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	boxContainer: { marginTop: 24 },
	boxText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white',
		textAlign: 'center',
	},
});
