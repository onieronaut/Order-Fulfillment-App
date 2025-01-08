import { SelectBox } from '@/components/SelectBox';
import { getBoxes } from '@/db/database';
import { createPackage } from '@/db/packages/database';
import { BoxType } from '@/types';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Label, PortalProvider, XStack, YStack } from 'tamagui';

export default function CreatePackageModal() {
	const [boxes, setBoxes] = useState<BoxType[]>([]);
	const [selectedBox, setSelectedBox] = useState('');

	const router = useRouter();

	async function handleCreatePackage() {
		if (!selectedBox) return;

		console.log(selectedBox);

		const box = boxes?.find((x) => x.boxId === parseInt(selectedBox));

		const payload = {
			orderId: 1,
			boxId: box?.boxId,
			name: box?.name,
		};

		console.log(payload);

		try {
			await createPackage(payload);
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
		<PortalProvider>
			<YStack>
				<XStack alignItems='center' gap='$4' padding={10}>
					<Label htmlFor='name'>Box Size</Label>
					<SelectBox
						id={'name'}
						label='Box Sizes'
						placeholder={'Select box size'}
						size={'$2'}
						value={selectedBox}
						setValue={setSelectedBox}
						native
						items={boxes}
						identifier={'boxId'}
					/>
				</XStack>
				<Button theme='accent' onPress={handleCreatePackage}>
					Create
				</Button>
			</YStack>
		</PortalProvider>
	);
}
