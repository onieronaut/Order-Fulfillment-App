import Button from '@/components/Button';
import { Text, View } from '@/components/Themed';
import { getBoxes } from '@/db/database';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function PackagesScreen() {
	async function createPackage() {
		try {
			const result = await getBoxes();
			console.log(result);
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<View style={styles.container}>
			<Link href='/createpackage' asChild>
				<Button>Create Package</Button>
			</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	buttonContainer: {},
});
