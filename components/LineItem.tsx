import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ItemType } from '@/types';
import { Card, H3, H6, Paragraph, SizableText, XStack, YStack } from 'tamagui';
import { StatusChip } from './ui/StatusChip';

interface LineItemPropsType {
	item: ItemType;
}

export const LineItem = ({ item }: LineItemPropsType) => {
	return (
		<Card size='$5'>
			<Card.Header>
				<XStack justifyContent='space-between'>
					<H3>{item.name}</H3>
					<StatusChip status={item.status} />
				</XStack>
				<SizableText size='$4'>Quantity: {item?.quantity}</SizableText>
				<SizableText size='$4'>
					Quantity Packed: {item?.quantityPackaged}
				</SizableText>
			</Card.Header>
		</Card>
	);
};
