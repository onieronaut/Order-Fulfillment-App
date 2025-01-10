import { getPackages } from '@/db/packages/database';
import { addPackagesToShipment } from '@/db/shipments/database';
import { PackageType, ShipmentType } from '@/types';
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

interface AddPackagesToShipmentPropsType {
	shipment: ShipmentType;
	setOpen: any;
	open: boolean;
}

export const AddPackagesToShipment = ({
	shipment,
	open,
	setOpen,
}: AddPackagesToShipmentPropsType) => {
	const [position, setPosition] = React.useState(0);
	const [packages, setPackages] = useState<PackageType[]>([]);

	const [checkboxes, setCheckboxes] = useState({});

	useEffect(() => {
		if (!open) return;

		async function handleGetPackages() {
			try {
				const packages = await getPackages(shipment.orderId);
				setPackages(packages);

				setCheckboxes(
					packages?.reduce((acc, item) => {
						return { ...acc, [item.packageId]: false };
					}, {})
				);
			} catch (err) {
				console.log(err);
			}
		}

		handleGetPackages();
	}, [open]);

	async function handleAddPackagesToShipment() {
		const data = {
			packageIds: Object.entries(checkboxes)
				.filter(([key, value]) => value === true)
				.map(([key]) => key),
		};

		console.log(data);

		try {
			await addPackagesToShipment(shipment.shipmentId, shipment.orderId, data);
			setOpen(false);
		} catch (err) {
			console.log(err);
		}
	}

	console.log(shipment);

	return (
		<>
			<Sheet
				forceRemoveScrollEnabled={open}
				modal={true}
				open={open}
				onOpenChange={setOpen}
				snapPoints={[70, 70]}
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
						<H4 textAlign='center'>
							Add Packages to Shipment #{shipment.shipmentId}
						</H4>
						<Separator marginVertical={5} />
						<Sheet.ScrollView width='100%' padding='$4' paddingTop={0}>
							{packages
								.filter((_package) => _package.status === 'Packed')
								.map((_package, index) => (
									<XStack alignItems='center' gap='$4' key={_package.packageId}>
										<Checkbox
											size={'$6'}
											checked={checkboxes[_package.packageId]}
											onCheckedChange={() =>
												setCheckboxes((prevState) => ({
													...prevState,
													[_package.packageId]: !prevState[_package.packageId],
												}))
											}>
											<Checkbox.Indicator>
												<Check />
											</Checkbox.Indicator>
										</Checkbox>

										<Label size={'$6'}>Package #{index + 1}</Label>
										<Label size={'$4'}>{_package.name}</Label>
										<Label size={'$4'}>
											{_package?.items?.length || 0} Items
										</Label>
									</XStack>
								))}
						</Sheet.ScrollView>
						<Separator marginVertical={5} />
						<Button onPress={handleAddPackagesToShipment} theme='accent'>
							Add to Shipment
						</Button>
					</YStack>
				</Sheet.Frame>
			</Sheet>
		</>
	);
};
