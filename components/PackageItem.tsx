import {
	deletePackage,
	finishPackage,
	removeLineItemFromPackage,
	undoFinishPackage,
} from '@/db/packages/database';
import { PackageType } from '@/types';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
	XGroup,
	XStack,
	YStack,
} from 'tamagui';
import { AddLineItemToPackage } from './AddLineItemToPackage';
import { AlertError } from './ui/./AlertError';
import { StatusChip } from './ui/StatusChip';

interface PackageItemPropsType {
	_package: PackageType;
	index: number;
	handleGetPackages: () => void;
}

export const PackageItem = ({
	_package,
	index,
	handleGetPackages,
}: PackageItemPropsType) => {
	const [open, setOpen] = useState(false);
	const [alert, setAlert] = useState(false);
	const [error, setError] = useState({});

	async function handleRemoveLineItemFromPackage(packageItemId: string) {
		try {
			await removeLineItemFromPackage(packageItemId);
			await handleGetPackages();
		} catch (err) {
			console.log(err);
		}
	}

	async function handleFinishPackage() {
		if (_package.items.length === 0) {
			setError({
				title: 'Error',
				description: 'Package contains no items',
			});
			return setAlert(true);
		}

		try {
			await finishPackage(_package.packageId);
			await handleGetPackages();
		} catch (err) {
			console.log(err);
		}
	}

	async function handleUndoFinishPackage() {
		try {
			await undoFinishPackage(_package.packageId);
			await handleGetPackages();
		} catch (err) {
			console.log(err);
		}
	}

	async function handleDeletePackage() {
		try {
			await deletePackage(_package.packageId);
			await handleGetPackages();
		} catch (err) {
			console.log(err);
		}
	}

	const OpenPackageButtons = () => {
		return (
			<XGroup>
				<XGroup.Item>
					<Button
						minWidth={'33%'}
						onPress={handleDeletePackage}
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
						Add Item
					</Button>
				</XGroup.Item>
				<Separator vertical />

				<XGroup.Item>
					<Button
						minWidth={'33%'}
						onPress={handleFinishPackage}
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
				</XGroup.Item>
			</XGroup>
		);
	};

	const PackedPackageButtons = () => {
		return (
			<Button
				minWidth={'100%'}
				onPress={handleUndoFinishPackage}
				theme='accent'
				icon={<Ionicons name='arrow-undo-circle' size={16} color='white' />}>
				Undo Finish
			</Button>
		);
	};

	return (
		<Card size='$5'>
			<AlertError open={alert} setOpen={setAlert} error={error} />
			<AddLineItemToPackage
				_package={_package}
				index={index}
				open={open}
				setOpen={setOpen}
				handleGetPackages={handleGetPackages}
			/>
			<Card.Header>
				<XStack justifyContent='space-between'>
					<YStack>
						<H3>Package #{index + 1}</H3>
						<SizableText theme='alt2'>{_package.name}</SizableText>
					</YStack>
					<StatusChip status={_package.status} />
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
										{_package.status === 'Open' && (
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
					{_package.status === 'Open' && <OpenPackageButtons />}
					{_package.status === 'Packed' && <PackedPackageButtons />}
				</XStack>
			</Card.Footer>
		</Card>
	);
};
