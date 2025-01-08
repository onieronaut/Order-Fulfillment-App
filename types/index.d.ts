export type OrderType = {
	orderId: number;
	createdAt: number;
	items: LineItemType[];
	status: 'Pending' | 'Shipped' | 'Packed';
};

export type ItemType = {
	itemId: number;
	orderId: number;
	name: string;
	quantity: number;
	status: 'Pending' | 'Packed' | 'Shipped';
	quantityPackaged: number;
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
	items: PackagedItemType[];
};

export type LineItemType = {
	itemId: number;
	orderId: number;
	name: string;
	quantity: number;
	quantityPackaged: number;
	status: 'Packed' | 'Shipped' | 'Pending';
};

export type PackagedItemType = {
	packageItemId: number;
	packageId: number;
	itemId: number;
	orderId: number;
	name: string;
	quantity: number;
};

export type ShipmentType = {
	shipmentId: number;
	orderId: number;
	shippedAt: number;
	packages: PackageType[];
	status: 'Pending' | 'Shipped';
};
