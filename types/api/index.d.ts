export type GetOrderType = {
	orderId: number;
	createdAt: number;
	status: 'Packed' | 'Pending' | 'Shipped';
};
