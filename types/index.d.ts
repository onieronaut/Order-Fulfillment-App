export type OrderType = {
	orderId: number;
	createdAt: number;
	items: LineItemType[];
};

export type ItemType = {
	itemId: number;
	orderId: number;
	name: string;
	quantity: number;
};

export type BoxType = {
	boxId: number;
	name: string;
};

export type PackageType = {
	packageId: number;
	boxId: number;
	orderId: number;
	name: string;
	status: 'Packed' | 'Shipped' | 'Open';
	items: any;
};

export type LineItemType = {
	itemId: number;
	orderId: number;
	name: string;
	quantity: number;
	quantityPackaged: number;
	status: 'Packed' | 'Shipped' | 'Pending';
};
