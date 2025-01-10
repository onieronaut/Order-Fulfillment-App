import { OrderType } from '@/types';
import { Link } from 'expo-router';
import { Button, Card, Paragraph, SizableText, XStack, YStack } from 'tamagui';

interface OrderItemPropsType {
	order: OrderType;
}

export const OrderItem = ({ order }: OrderItemPropsType) => {
	return (
		<Card size='$5'>
			<XStack alignItems='center'>
				<XStack flex={1}>
					<Card.Header>
						<SizableText size='$4' fontWeight='bold'>
							Order #{order.orderId}
						</SizableText>
						<Paragraph color='$accentColor'>
							{new Date(order.createdAt * 1000).toLocaleDateString()}
						</Paragraph>
					</Card.Header>
				</XStack>
				<XStack flex={1} justifyContent='center'>
					<YStack alignContent='center' justifyContent='center'>
						<Paragraph>Items: {order?.items?.length}</Paragraph>
						<Paragraph>Status: {order?.status}</Paragraph>
					</YStack>
				</XStack>

				<XStack flex={1} justifyContent='center'>
					<Link
						href={{
							pathname: '/(orders)/[orderId]',
							params: { orderId: order.orderId },
						}}
						asChild>
						<Button theme='accent'>
							{order.status !== 'Shipped' ? 'Fulfill' : 'View'}
						</Button>
					</Link>
				</XStack>
			</XStack>
		</Card>
	);
};
