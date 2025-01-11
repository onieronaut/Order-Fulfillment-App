import { OrderType } from '@/types';
import { Link } from 'expo-router';
import {
	Button,
	Card,
	H3,
	Paragraph,
	SizableText,
	XStack,
	YStack,
} from 'tamagui';
import { StatusChip } from './ui/StatusChip';
import { MaterialIcons } from '@expo/vector-icons';
import { Inspect } from '@tamagui/lucide-icons';

interface OrderItemPropsType {
	order: OrderType;
	index: number;
}

export const OrderItem = ({ order, index }: OrderItemPropsType) => {
	return (
		<Card size='$5'>
			<Card.Header>
				<XStack justifyContent='space-between'>
					<YStack>
						<H3>Order #{index + 1}</H3>
						<Paragraph color='$accentColor'>
							{new Date(order.createdAt * 1000).toLocaleDateString()}
						</Paragraph>
						<Paragraph>Items: {order?.items?.length}</Paragraph>
					</YStack>
					<StatusChip status={order.status} />
				</XStack>
			</Card.Header>
			<XStack flex={1} justifyContent='center'>
				<Link
					href={{
						pathname: '/(orders)/[orderId]',
						params: { orderId: order.orderId },
					}}
					asChild>
					<Button
						theme='accent'
						width={'100%'}
						icon={<Inspect size={18} color='white' />}>
						{order.status !== 'Shipped' ? 'Fulfill' : 'View'}
					</Button>
				</Link>
			</XStack>
		</Card>
	);
};
