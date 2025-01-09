import {
	finishPackage,
	removeLineItemFromPackage,
	undoFinishPackage,
} from '@/db/packages/database';
import { PackageType } from '@/types';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ChevronDown } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import React from 'react';
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

interface PackageItemPropsType {
	_package: PackageType;
	index: number;
}

export const PackageItem = ({ _package, index }: PackageItemPropsType) => {
	async function handleRemoveLineItemFromPackage(packageItemId: number) {
		console.log(packageItemId);

		try {
			await removeLineItemFromPackage(packageItemId);
		} catch (err) {
			console.log(err);
		}
	}

	async function handleFinishPackage(packageId: number) {
		try {
			await finishPackage(packageId);
		} catch (err) {
			console.log(err);
		}
	}

	async function handleUndoFinishPackage(packageId: number) {
		try {
			await undoFinishPackage(packageId);
		} catch (err) {
			console.log(err);
		}
	}

	const OpenPackageButtons = () => {
		return (
			<YGroup flex={1}>
				<Button
					theme='accent'
					icon={<Entypo name='circle-with-cross' size={16} color='white' />}>
					Delete
				</Button>
				<Link
					href={{
						pathname: '/addlineitem',
						params: {
							orderId: _package.orderId,
							packageId: _package.packageId,
						},
					}}
					asChild>
					<Button
						theme='accent'
						icon={<Entypo name='circle-with-plus' size={16} color='white' />}>
						Add Item
					</Button>
				</Link>
				<Button
					onPress={() => handleFinishPackage(_package.packageId)}
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
			</YGroup>
		);
	};

	const PackedPackageButtons = () => {
		return (
			<YGroup flex={1}>
				<Button
					onPress={() => handleUndoFinishPackage(_package.packageId)}
					theme='accent'
					icon={<Ionicons name='arrow-undo-circle' size={16} color='white' />}>
					Undo Finish
				</Button>
			</YGroup>
		);
	};

	return (
		<Card size='$5'>
			<YStack flex={1}>
				<XStack>
					<XStack flex={1}>
						<Card.Header>
							<H3>{_package.name}</H3>
							<SizableText size='$4'>Package #{index + 1}</SizableText>
							<SizableText size='$4'>Status: {_package?.status}</SizableText>
						</Card.Header>
					</XStack>
					<XStack flex={1} justifyContent='center'>
						{_package.status === 'Open' && <OpenPackageButtons />}
						{_package.status === 'Packed' && <PackedPackageButtons />}
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
									Line Items: {_package?.items?.length || 0}
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
								{_package.items.map((item) => (
									<XStack key={item.packageItemId} alignItems='center'>
										<XStack gap={'$3'} flex={1}>
											<SizableText>{item.name}</SizableText>
											<SizableText>Quantity: {item.quantity}</SizableText>
										</XStack>
										<XStack>
											<Button
												onPress={() =>
													handleRemoveLineItemFromPackage(item.packageItemId)
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
