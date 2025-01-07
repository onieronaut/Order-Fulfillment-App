import Button from '@/components/Button';
import { PackageItem } from '@/components/PackageItem';
import { Text, View } from '@/components/Themed';
import { getBoxes, getPackages } from '@/db/database';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

export default function PackagesScreen() {
	const [packages, setPackages] = useState<any>([]);

	useEffect(() => {
		async function handleGetPackages() {
			try {
				const result = await getPackages(1);
				setPackages(result);
				console.log(result);
			} catch (err) {
				console.log(err);
			}
		}
		handleGetPackages();
	}, []);

	return (
		<View style={styles.container}>
			<Link href='/createpackage' asChild>
				<Button>Create Package</Button>
			</Link>
			<View>
				<FlatList
					data={packages}
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
	buttonContainer: {},
});
