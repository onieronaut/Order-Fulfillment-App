import { Text, View } from '@/components/Themed';
import { getOrder } from '@/db/database';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function DetailsScreen() {
	const [order, setOrder] = useState();

	useEffect(() => {
		async function fetchOrder() {
			try {
				const result = await getOrder(1);
				setOrder(result as any);
				console.log(result);
			} catch (err) {
				console.log(err);
			}
		}

		fetchOrder();
	}, []);

	return (
		<View style={styles.container}>
			<Text>Details</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
