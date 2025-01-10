import { getOrder } from '@/db/orders/database';
import { addLineItemToPackage, getPackages } from '@/db/packages/database';
import { addPackagesToShipment } from '@/db/shipments/database';
import { OrderType, PackageType, ShipmentType } from '@/types';
import { Check } from '@tamagui/lucide-icons';
import { Sheet } from '@tamagui/sheet';
import React, { useEffect, useState } from 'react';
import {
	Button,
	Checkbox,
	H4,
	Input,
	Label,
	Separator,
	XStack,
	YStack,
} from 'tamagui';
import { SelectBox } from './ui/SelectBox';

interface AddLineItemToPackagePropsType {
	_package: PackageType;
	setOpen: any;
	open: boolean;
}

export const AddLineItemToPackage = ({
	_package,
	open,
	setOpen,
}: AddLineItemToPackagePropsType) => {
	const [position, setPosition] = React.useState(0);
	const [order, setOrder] = useState<OrderType>();
	const [selectedItem, setSelectedItem] = useState();
	const [number, onChangeNumber] = useState('');

	const initialSnapPoints = [30, 30];
	const keypadSnapPoints = [70, 70];

	const [snapPoints, setSnapPoints] = useState(initialSnapPoints);

	async function handleAddLineItemToPackage() {
		if (!selectedItem) return;

		const item = order?.items.find(
			(item) => item.itemId === parseInt(selectedItem)
		);

		const payload = {
			orderId: _package.orderId,
			packageId: _package.packageId,
			itemId: item?.itemId,
			name: item?.name,
			quantity: number,
		};

		console.log(payload);

		try {
			const res = await addLineItemToPackage(payload as any);
			setOpen(false);
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		if (!open) return;

		// setSnapPoints(initialSnapPoints);

		async function handleGetOrder() {
			try {
				const result = await getOrder(_package.orderId);
				setOrder(result as any);
			} catch (err) {
				console.log(err);
			}
		}

		handleGetOrder();
	}, [open]);

	return (
		<Sheet
			forceRemoveScrollEnabled={open}
			modal={true}
			open={open}
			onOpenChange={setOpen}
			snapPoints={snapPoints}
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
					<H4 textAlign='center'>Add Item to Package #{_package.packageId}</H4>
					<Separator marginVertical={5} />
					<XStack alignItems='center'>
						<XStack flex={1}>
							<Label>Item</Label>
						</XStack>
						<SelectBox
							id={'x'}
							label='Items'
							placeholder={'Select Item'}
							size={'$2'}
							value={selectedItem}
							setValue={setSelectedItem}
							native
							items={order?.items}
							identifier={'itemId'}
						/>
					</XStack>
					<XStack alignItems='center' gap={'$5'}>
						<XStack>
							<Label>Quantity</Label>
						</XStack>
						<Input
							width={60}
							keyboardType='number-pad'
							onChangeText={onChangeNumber}
							value={number}
							returnKeyType='done'
							onFocus={() => setSnapPoints(keypadSnapPoints)}
							onBlur={() => setSnapPoints(initialSnapPoints)}
						/>
					</XStack>
					<Separator marginVertical={5} />
					<Button onPress={handleAddLineItemToPackage} theme='accent'>
						Add to Package
					</Button>
				</YStack>
			</Sheet.Frame>
		</Sheet>
	);
};
