export type GetOrderType = {
	orderId: string;
	createdAt: number;
	status: 'Packed' | 'Pending' | 'Shipped';
};
