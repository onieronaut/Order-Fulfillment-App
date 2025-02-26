import { CreatePackage } from '@/components/CreatePackage';
import { PackageItem } from '@/components/PackageItem';
import { getPackages } from '@/db/packages/database';
import { PackageType } from '@/types';
import { useFocusEffect, useGlobalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { H3, Text, YStack } from 'tamagui';

export default function PackagesScreen() {
	const { orderId } = useGlobalSearchParams<{ orderId: string }>();

	const [packages, setPackages] = useState<PackageType[]>([]);

	async function handleGetPackages() {
		try {
			const result = await getPackages(orderId);
			setPackages(result);
		} catch (err) {
			console.log(err);
		}
	}

	useFocusEffect(
		useCallback(() => {
			if (!orderId) return;

			handleGetPackages();

			return () => {};
		}, [orderId])
	);

	return (
		<YStack flex={1} padding={10}>
			{packages.length === 0 && <H3 textAlign='center'>No Packages Exist</H3>}
			<FlatList
				data={packages}
				keyExtractor={(item) => `${item.packageId}`}
				renderItem={({ item, index }) => (
					<YStack padding={5}>
						<PackageItem
							_package={item}
							index={index}
							handleGetPackages={handleGetPackages}
						/>
					</YStack>
				)}
			/>
			<YStack height={'10%'} justifyContent='center'>
				<CreatePackage
					orderId={orderId}
					handleGetPackages={handleGetPackages}
				/>
			</YStack>
		</YStack>
	);
}
