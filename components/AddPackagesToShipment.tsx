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
	SizableText,
	XStack,
	YStack,
} from 'tamagui';
import { AlertError } from './ui/AlertError';

interface AddPackagesToShipmentPropsType {
	shipment: ShipmentType;
	setOpen: any;
	open: boolean;
	index: number;
	handleGetShipments: () => void;
}

export const AddPackagesToShipment = ({
	shipment,
	open,
	setOpen,
	index,
	handleGetShipments,
}: AddPackagesToShipmentPropsType) => {
	const [position, setPosition] = React.useState(0);
	const [packages, setPackages] = useState<PackageType[]>([]);
	const [alert, setAlert] = useState(false);
	const [error, setError] = useState({});
	const [checkboxes, setCheckboxes] = useState({});

	function handleValidation() {
		if (!Object.values(checkboxes).some((checkbox) => checkbox)) {
			setError({ title: 'Error', description: 'No packages seleceted' });
			setAlert(true);
			return false;
		}

		return true;
	}

	console.log(packages);

	function handleResetForm() {
		setCheckboxes(
			packages?.reduce((acc, item) => {
				return { ...acc, [item.packageId]: false };
			}, {})
		);
	}

	async function handleAddPackagesToShipment() {
		if (!handleValidation()) return;

		const data = {
			packageIds: Object.entries(checkboxes)
				.filter(([key, value]) => value === true)
				.map(([key]) => key),
		};

		try {
			await addPackagesToShipment(shipment.shipmentId, shipment.orderId, data);
			await handleGetShipments();
			setOpen(false);
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		if (!open) return;

		async function handleGetPackages() {
			try {
				const packages = await getPackages(shipment.orderId);
				setPackages(packages);
				handleResetForm();
			} catch (err) {
				console.log(err);
			}
		}

		handleGetPackages();
	}, [open]);

	console.log('ship', shipment);

	return (
		<>
			<AlertError open={alert} setOpen={setAlert} error={error} />
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
						<H4 textAlign='center'>Add Packages to Shipment #{index + 1}</H4>
						<Separator marginVertical={5} />
						<Sheet.ScrollView width='100%' padding='$4' paddingTop={0}>
							{packages.filter((_package) => _package.status === 'Packed')
								.length === 0 && (
								<H4 textAlign='center'>No packages available</H4>
							)}
							{packages
								.map((_package, i) => ({ ..._package, i }))
								.filter((_package) => _package.status === 'Packed')
								.filter((_package) => _package.shipmentPackageId === '')
								.map((_package) => (
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
										<Label size={'$6'}>Package #{_package.i + 1}</Label>
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
