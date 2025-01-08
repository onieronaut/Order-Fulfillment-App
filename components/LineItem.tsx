import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ItemType } from '@/types';
import { Card, H3, H6, Paragraph, SizableText, XStack, YStack } from 'tamagui';

interface LineItemPropsType {
	item: ItemType;
}

export const LineItem = ({ item }: LineItemPropsType) => {
	return (
		<Card size='$5'>
			<Card.Header>
				<H3>{item.name}</H3>
			</Card.Header>
			<Card.Footer padded>
				<XStack flex={1} justifyContent='center'>
					<YStack alignContent='center' justifyContent='center' gap={'$2'}>
						<SizableText size='$4'>Quantity: {item?.quantity}</SizableText>
						<SizableText size='$4'>
							Quantity Packed: {item?.quantityPackaged}
						</SizableText>
					</YStack>
				</XStack>
				<XStack flex={1} justifyContent='center'>
					<SizableText size='$4'>Status: {item?.status}</SizableText>
				</XStack>
			</Card.Footer>
		</Card>
	);
};
