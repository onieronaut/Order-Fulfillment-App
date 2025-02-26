import { createPackage, getPackages } from '@/db/packages/database';
import { addPackagesToShipment } from '@/db/shipments/database';
import { BoxType, PackageType, ShipmentType } from '@/types';
import { Check } from '@tamagui/lucide-icons';
import { Sheet } from '@tamagui/sheet';
import React, { useEffect, useState } from 'react';
import {
	Button,
	Checkbox,
	H4,
	Label,
	Separator,
	XStack,
	YStack,
} from 'tamagui';
import { SelectBox } from './ui/SelectBox';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getBoxes } from '@/db/boxes/database';

interface CreatePackagePropsType {
	orderId: string;
	handleGetPackages: () => void;
}

export const CreatePackage = ({
	orderId,
	handleGetPackages,
}: CreatePackagePropsType) => {
	const [position, setPosition] = React.useState(0);
	const [open, setOpen] = useState(false);

	const [boxes, setBoxes] = useState<BoxType[]>([]);
	const [selectedBox, setSelectedBox] = useState('');

	async function handleCreatePackage() {
		if (!selectedBox) return;

		const box = boxes?.find((x) => x.boxId === selectedBox);

		const payload = {
			boxId: box?.boxId,
			name: box?.name,
		};

		try {
			await createPackage(orderId, payload);
			await handleGetPackages();
			setOpen(false);
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

	useEffect(() => {
		function handleResetForm() {
			setSelectedBox('');
		}

		handleResetForm();
	}, [open]);

	return (
		<>
			<Button
				theme='accent'
				onPress={() => setOpen(true)}
				icon={
					<MaterialCommunityIcons
						name='package-variant'
						size={18}
						color='white'
					/>
				}>
				Create Package
			</Button>
			<Sheet
				forceRemoveScrollEnabled={open}
				modal={true}
				open={open}
				onOpenChange={setOpen}
				snapPoints={[30, 30]}
				snapPointsMode={'percent'}
				dismissOnSnapToBottom
				position={position}
				onPositionChange={setPosition}
				zIndex={100_000}
				animation='medium'>
				<Sheet.Overlay
					animation='lazy'
					enterStyle={{ opacity: 0 }}
					exitStyle={{ opacity: 0 }}
				/>
				<Sheet.Frame padding='$4' justifyContent='center' alignItems='center'>
					<YStack flex={1} width={'100%'} gap='$2'>
						<H4 textAlign='center'>Create Package</H4>
						<Separator marginVertical={5} />
						<XStack alignItems='center'>
							<XStack flex={1}>
								<Label>Box Size</Label>
							</XStack>
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
						<Separator marginVertical={5} />
						<Button onPress={handleCreatePackage} theme='accent'>
							Create
						</Button>
					</YStack>
				</Sheet.Frame>
			</Sheet>
		</>
	);
};
