export type OrderType = {
	orderId: string;
	createdAt: number;
	items: LineItemType[];
	status: 'Pending' | 'Shipped' | 'Packed';
};

export type ItemType = {
	itemId: string;
	orderId: string;
	name: string;
	quantity: number;
	status: 'Pending' | 'Packed' | 'Shipped';
	quantityPackaged: number;
};

export type BoxType = {
	boxId: string;
	name: string;
};

export type PackageType = {
	packageId: string;
	boxId: string;
	orderId: string;
	shipmentPackageId: string;
	name: string;
	status: 'Packed' | 'Shipped' | 'Open';
	items: PackagedItemType[];
};

export type LineItemType = {
	itemId: string;
	orderId: string;
	name: string;
	quantity: number;
	quantityPackaged: number;
	status: 'Packed' | 'Shipped' | 'Pending';
};

export type PackagedItemType = {
	packageItemId: string;
	packageId: string;
	itemId: string;
	orderId: string;
	name: string;
	quantity: number;
	quantityPackaged: number;
};

export type ShipmentType = {
	shipmentId: string;
	orderId: string;
	shippedAt: number;
	packages: PackageType[];
	status: 'Pending' | 'Shipped';
};

export type ShipmentPackageType = {
	shipmentPackageId: string;
	shipmentId: string;
	orderId: string;
	packageId: string;
};
