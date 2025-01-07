export type OrderType = {
	orderId: number;
	createdAt: number;
	items: any;
};

export type ItemType = {
	itemId: number;
	orderId: number;
	name: string;
	quantity: number;
};
