import { ShipmentType } from '@/types';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { ChevronDown } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import {
	Accordion,
	Button,
	Card,
	H3,
	Paragraph,
	SizableText,
	Square,
	XStack,
	YGroup,
	YStack,
} from 'tamagui';
import { AddPackagesToShipment } from './AddPackagesToShipment';
import {
	deleteShipment,
	removePackageFromShipment,
	shipShipment,
} from '@/db/shipments/database';
import dayjs from 'dayjs';

interface OrderItemPropsType {
	shipment: ShipmentType;
	index: number;
}

export const ShipmentItem = ({ shipment, index }: OrderItemPropsType) => {
	const [open, setOpen] = useState(false);

	async function handleDeleteShipment() {
		try {
			await deleteShipment(shipment.shipmentId);
		} catch (err) {
			console.log(err);
		}
	}

	async function handleShipShipment() {
		try {
			await shipShipment(shipment);
		} catch (err) {
			console.log(err);
		}
	}

	async function handleRemovePackageFromShipment(packageId: number) {
		try {
			await removePackageFromShipment(packageId);
		} catch (err) {
			console.log(err);
		}
	}

	const PendingShipmentButtons = () => {
		return (
			<YGroup flex={1}>
				<YGroup.Item>
					<Button
						onPress={handleDeleteShipment}
						theme='accent'
						icon={<Entypo name='circle-with-cross' size={16} color='white' />}>
						Delete
					</Button>
				</YGroup.Item>
				<YGroup.Item>
					<Button
						theme='accent'
						icon={<Entypo name='circle-with-plus' size={16} color='white' />}
						onPress={() => {
							setOpen(true);
						}}>
						Add Packages
					</Button>
				</YGroup.Item>
				<YGroup.Item>
					<Button
						onPress={handleShipShipment}
						theme='accent'
						icon={
							<MaterialCommunityIcons
								name='check-circle'
								size={16}
								color='white'
							/>
						}>
						Ship
					</Button>
				</YGroup.Item>
			</YGroup>
		);
	};

	return (
		<Card size='$5'>
			<AddPackagesToShipment
				shipment={shipment}
				open={open}
				setOpen={setOpen}
			/>
			<YStack flex={1}>
				<XStack>
					<XStack flex={1}>
						<Card.Header>
							<H3>Shipment #{index + 1}</H3>
							<SizableText size='$4'>Status: {shipment?.status}</SizableText>
							{shipment.status === 'Shipped' && (
								<SizableText size='$4'>
									Shipped At:{' '}
									{dayjs(shipment?.shippedAt).format('MM/DD/YY @ hh:mm A')}
								</SizableText>
							)}
						</Card.Header>
					</XStack>
					{shipment.status === 'Pending' && (
						<XStack flex={1} justifyContent='center'>
							<PendingShipmentButtons />

							{/* {_package.status === 'Packed' && <PackedPackageButtons />} */}
						</XStack>
					)}
				</XStack>
			</YStack>
			<Accordion
				overflow='hidden'
				width='100%'
				type='single'
				collapsible
				borderRadius={'$3.5'}>
				<Accordion.Item value='a1'>
					<Accordion.Trigger
						flexDirection='row'
						justifyContent='space-between'
						borderWidth={0}>
						{({ open }: { open: boolean }) => (
							<>
								<Paragraph>
									Packages: {shipment?.packages?.length || 0}
								</Paragraph>
								<Square animation='quick' rotate={open ? '180deg' : '0deg'}>
									<ChevronDown size='$1' />
								</Square>
							</>
						)}
					</Accordion.Trigger>
					<Accordion.HeightAnimator animation='medium'>
						<Accordion.Content animation='medium' exitStyle={{ opacity: 0 }}>
							<YStack gap={'$2'}>
								{shipment?.packages?.map((_package) => (
									<XStack key={_package?.packageId} alignItems='center'>
										<XStack gap={'$3'} flex={1}>
											<SizableText>{_package?.name}</SizableText>
											<SizableText>
												Items: {_package?.items.length || 0}
											</SizableText>
										</XStack>
										{shipment?.status === 'Pending' && (
											<XStack>
												<Button
													onPress={() =>
														handleRemovePackageFromShipment(_package.packageId)
													}
													size='$2'
													icon={
														<Entypo
															name='circle-with-cross'
															size={12}
															color='white'
														/>
													}>
													Remove
												</Button>
											</XStack>
										)}
									</XStack>
								))}
							</YStack>
						</Accordion.Content>
					</Accordion.HeightAnimator>
				</Accordion.Item>
			</Accordion>
		</Card>
	);
};
