import Button from '@/components/Button';
import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';

export default function PackagesScreen() {
	return (
		<View style={styles.container}>
			<Button onPress={() => {}}>Create Package</Button>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	buttonContainer: {},
});
