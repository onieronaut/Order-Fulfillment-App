import Button from '@/components/Button';
import { PackageItem } from '@/components/PackageItem';
import { View } from '@/components/Themed';
import { getPackages } from '@/db/packages/database';
import { PackageType } from '@/types';
import { Link, useFocusEffect, useGlobalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

export default function PackagesScreen() {
	const { orderId } = useGlobalSearchParams<{ orderId: string }>();

	const [packages, setPackages] = useState<PackageType[]>([]);

	useFocusEffect(
		useCallback(() => {
			if (!orderId) return;

			async function handleGetPackages() {
				try {
					const result = await getPackages(parseInt(orderId));
					setPackages(result);
				} catch (err) {
					console.log(err);
				}
			}
			handleGetPackages();

			return () => {};
		}, [orderId])
	);

	return (
		<View style={styles.container}>
			<Link href={{ pathname: '/createpackage' }} asChild>
				<Button>Create Package</Button>
			</Link>
			<View>
				<FlatList
					data={packages}
					keyExtractor={(item) => item.packageId.toString()}
					renderItem={({ item }) => <PackageItem _package={item} />}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
