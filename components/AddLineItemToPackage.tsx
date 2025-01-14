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
	SizableText,
	XStack,
	YStack,
} from 'tamagui';
import { SelectBox } from './ui/SelectBox';
import { AlertError } from './ui/AlertError';

interface AddLineItemToPackagePropsType {
	_package: PackageType;
	index: number;
	setOpen: any;
	open: boolean;
	handleGetPackages: () => void;
}

export const AddLineItemToPackage = ({
	_package,
	open,
	setOpen,
	index,
	handleGetPackages,
}: AddLineItemToPackagePropsType) => {
	const [position, setPosition] = React.useState(0);
	const [order, setOrder] = useState<OrderType>();
	const [selectedItem, setSelectedItem] = useState();
	const [quantityAvailable, setQuantityAvailable] = useState(0);
	const [quantity, setQuantity] = useState('');
	const [alert, setAlert] = useState(false);
	const [error, setError] = useState({});

	const initialSnapPoints = [30, 30];
	const keypadSnapPoints = [70, 70];

	const [snapPoints, setSnapPoints] = useState(initialSnapPoints);

	function handleValidation() {
		if (!selectedItem) {
			setError({
				title: 'Error',
				description: 'No item selected',
			});
			setAlert(true);
			return false;
		}

		if (quantity === '') {
			setError({
				title: 'Error',
				description: 'No quantity entered',
			});
			setAlert(true);
			return false;
		}

		if (parseInt(quantity) > quantityAvailable) {
			setError({
				title: 'Error',
				description: 'Quantity selected exceeds available quantity',
			});
			setAlert(true);
			return false;
		}

		return true;
	}

	async function handleAddLineItemToPackage() {
		if (!handleValidation()) return;

		const item = order?.items.find((item) => item.itemId === selectedItem);

		const data = {
			quantity: parseInt(quantity),
			name: item.name,
		};

		try {
			await addLineItemToPackage(
				_package.orderId,
				_package.packageId,
				item.itemId,
				data
			);
			await handleGetPackages();

			setOpen(false);
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		if (!selectedItem) return;

		const item = order.items?.find((item) => item.itemId === selectedItem);

		setQuantityAvailable(item?.quantity - item?.quantityPackaged);
	}, [selectedItem]);

	useEffect(() => {
		if (!open) return;

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

	useEffect(() => {
		if (open) return;

		function handleResetForm() {
			setSelectedItem(null);
			setQuantity('');
		}

		handleResetForm();
	}, [open]);

	return (
		<>
			<AlertError open={alert} setOpen={setAlert} error={error} />
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
						<H4 textAlign='center'>Add Item to Package #{index + 1}</H4>
						<Separator marginVertical={5} />
						<XStack alignItems='center'>
							<XStack flex={1}>
								<Label>Item</Label>
							</XStack>
							<SelectBox
								id={`${_package.packageId}`}
								label='Items'
								placeholder={'Select Item'}
								size={'$2'}
								value={selectedItem}
								setValue={setSelectedItem}
								native
								items={order?.items.filter((item) => item.status === 'Pending')}
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
								onChangeText={setQuantity}
								value={quantity}
								returnKeyType='done'
								onFocus={() => setSnapPoints(keypadSnapPoints)}
								onBlur={() => setSnapPoints(initialSnapPoints)}
							/>
							{selectedItem && (
								<>
									<XStack>
										<Label>Quantity Available:</Label>
									</XStack>
									<SizableText>{quantityAvailable}</SizableText>
								</>
							)}
						</XStack>
						<Separator marginVertical={5} />
						<Button onPress={handleAddLineItemToPackage} theme='accent'>
							Add to Package
						</Button>
					</YStack>
				</Sheet.Frame>
			</Sheet>
		</>
	);
};
