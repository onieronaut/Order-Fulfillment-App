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
	Separator,
	SizableText,
	Square,
	Text,
	XGroup,
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
import { StatusChip } from './ui/StatusChip';

interface OrderItemPropsType {
	shipment: ShipmentType;
	index: number;
	handleGetShipments: () => void;
}

export const ShipmentItem = ({
	shipment,
	index,
	handleGetShipments,
}: OrderItemPropsType) => {
	const [open, setOpen] = useState(false);

	async function handleDeleteShipment() {
		try {
			await deleteShipment(shipment.shipmentId);
			await handleGetShipments();
		} catch (err) {
			console.log(err);
		}
	}

	async function handleShipShipment() {
		const data = { shipment };
		try {
			await shipShipment(data);
			await handleGetShipments();
		} catch (err) {
			console.log(err);
		}
	}

	async function handleRemovePackageFromShipment(packageId: string) {
		try {
			await removePackageFromShipment(packageId);
			await handleGetShipments();
		} catch (err) {
			console.log(err);
		}
	}

	const PendingShipmentButtons = () => {
		return (
			<XGroup>
				<XGroup.Item>
					<Button
						minWidth={'33%'}
						onPress={handleDeleteShipment}
						theme='accent'
						icon={<Entypo name='circle-with-cross' size={16} color='white' />}>
						Delete
					</Button>
				</XGroup.Item>
				<Separator vertical />

				<XGroup.Item>
					<Button
						minWidth={'33%'}
						theme='accent'
						icon={<Entypo name='circle-with-plus' size={16} color='white' />}
						onPress={() => {
							setOpen(true);
						}}>
						<YStack alignItems='center'>
							<Text>Add</Text>
							<Text>Packages</Text>
						</YStack>
					</Button>
				</XGroup.Item>
				<Separator vertical />

				<XGroup.Item>
					<Button
						minWidth={'33%'}
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
				</XGroup.Item>
			</XGroup>
		);
	};

	return (
		<Card size='$5'>
			<AddPackagesToShipment
				shipment={shipment}
				index={index}
				open={open}
				setOpen={setOpen}
				handleGetShipments={handleGetShipments}
			/>

			<Card.Header>
				<XStack justifyContent='space-between'>
					<YStack>
						<H3>Shipment #{index + 1}</H3>
						{shipment.status === 'Shipped' && (
							<SizableText size='$4'>
								Shipped At:{' '}
								{dayjs(shipment?.shippedAt).format('MM/DD/YY @ hh:mm A')}
							</SizableText>
						)}
					</YStack>
					<StatusChip status={shipment.status} />
				</XStack>
			</Card.Header>
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
			<Card.Footer>
				<XStack flex={1}>
					{shipment.status === 'Pending' && <PendingShipmentButtons />}
				</XStack>
			</Card.Footer>
		</Card>
	);
};
