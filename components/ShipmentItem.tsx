import { Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { OrderType, ShipmentType } from '@/types';
import {
	Accordion,
	Button,
	Card,
	H3,
	Paragraph,
	SizableText,
	Square,
	Text,
	View,
	XStack,
	YGroup,
	YStack,
} from 'tamagui';
import { ChevronDown } from '@tamagui/lucide-icons';
import React from 'react';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { SheetModal } from './ui/SheetModal';

interface OrderItemPropsType {
	shipment: ShipmentType;
	index: number;
}

export const ShipmentItem = ({ shipment, index }: OrderItemPropsType) => {
	const PendingShipmentButtons = () => {
		return (
			<YGroup flex={1}>
				<YGroup.Item>
					<Button
						theme='accent'
						icon={<Entypo name='circle-with-cross' size={16} color='white' />}>
						Delete
					</Button>
				</YGroup.Item>
				{/* <Link
					href={{
						pathname: '/addlineitem',
						params: {
							orderId: _package.orderId,
							packageId: _package.packageId,
						},
					}}
					asChild> */}
				{/* <YGroup.Item> */}
				<SheetModal
				// name={'Add Package'}
				// theme='accent'
				// icon={<Entypo name='circle-with-cross' size={16} color='white' />}
				/>
				{/* </YGroup.Item> */}
				{/* </Link> */}
				<YGroup.Item>
					<Button
						// onPress={() => handleFinishPackage(_package.packageId)}
						theme='accent'
						icon={
							<MaterialCommunityIcons
								name='check-circle'
								size={16}
								color='white'
							/>
						}>
						Finish
					</Button>
				</YGroup.Item>
			</YGroup>
		);
	};

	return (
		<Card size='$5'>
			<YStack flex={1}>
				<SheetModal
				// theme='accent'
				// icon={<Entypo name='circle-with-cross' size={16} color='white' />}
				/>
				<XStack>
					<XStack flex={1}>
						<Card.Header>
							<H3>Shipment #{index + 1}</H3>
							<SizableText size='$4'>Status: {shipment?.status}</SizableText>
						</Card.Header>
					</XStack>
					<XStack flex={1} justifyContent='center'>
						{shipment.status === 'Pending' && <PendingShipmentButtons />}
						{/* {_package.status === 'Packed' && <PackedPackageButtons />} */}
					</XStack>
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
										<XStack>
											<Button
												// onPress={() =>
												// 	handleRemoveLineItemFromPackage(item.packageItemId)
												// }
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
									</XStack>
								))}
							</YStack>
						</Accordion.Content>
					</Accordion.HeightAnimator>
				</Accordion.Item>
			</Accordion>
		</Card>
		// <View style={styles.container}>
		// 	<View style={styles.order}>
		// 		<Text>Shipment #{shipment.shipmentId}</Text>
		// 	</View>
		// 	<View style={styles.items}>
		// 		<Text>Packages: {shipment?.packages?.length}</Text>
		// 	</View>
		// 	<View style={styles.date}>
		// 		<Text>Status: {shipment.status}</Text>
		// 	</View>
		// 	<Link
		// 		href={{
		// 			pathname: '/addpackage',
		// 			params: {
		// 				orderId: shipment.orderId,
		// 				shipmentId: shipment.shipmentId,
		// 			},
		// 		}}
		// 		asChild>
		// 		<Pressable style={styles.buttonContainer}>
		// 			<Text>Add Item</Text>
		// 		</Pressable>
		// 	</Link>
		/* <Link
                href={{
                    pathname: '/(orders)/[orderId]',
                    params: { orderId: order.orderId },
                }}
                asChild>
                <Pressable style={styles.button}>
                    <Text>View Order</Text>
                </Pressable>
            </Link> */
		// </View>
	);
};
