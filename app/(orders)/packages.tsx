import { CreatePackage } from '@/components/CreatePackage';
import { PackageItem } from '@/components/PackageItem';
import { SelectBox } from '@/components/ui/SelectBox';
import { getPackages } from '@/db/packages/database';
import { PackageType } from '@/types';
import { Link, useFocusEffect, useGlobalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { Button, YStack } from 'tamagui';

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
		<YStack flex={1} padding={10}>
			<CreatePackage />
			<FlatList
				data={packages}
				keyExtractor={(item) => `${item.packageId}`}
				renderItem={({ item, index }) => (
					<YStack padding={5}>
						<PackageItem _package={item} index={index} />
					</YStack>
				)}
			/>
		</YStack>
	);
}
